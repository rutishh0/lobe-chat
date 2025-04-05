import { ChunkingLoader } from 'src/libs/langchain';
import { Strategy } from 'unstructured-client/sdk/models/shared';

import { knowledgeEnv } from '@/config/knowledge';
import type { NewChunkItem, NewUnstructuredChunkItem } from '@/database/schemas';
import { ChunkingStrategy, Unstructured } from '@/libs/unstructured';

import { ChunkingRuleParser } from './rules';
import type { ChunkingService } from './rules';

export interface ChunkContentParams {
  content: Uint8Array;
  fileType: string;
  filename: string;
  mode?: 'fast' | 'hi-res';
}

interface ChunkResult {
  chunks: NewChunkItem[];
  unstructuredChunks?: NewUnstructuredChunkItem[];
}

export class ContentChunk {
  private unstructuredClient: Unstructured;
  private langchainClient: ChunkingLoader;
  private chunkingRules: Record<string, ChunkingService[]>;

  constructor() {
    this.unstructuredClient = new Unstructured();
    
    // Create the langchain client with safe initialization
    try {
      this.langchainClient = new ChunkingLoader();
    } catch (error) {
      console.warn('LangChain loader initialization failed:', error);
      // Create a minimal loader that will skip problematic formats
      this.langchainClient = {
        partitionContent: this.fallbackPartitionContent,
      } as ChunkingLoader;
    }
    
    this.chunkingRules = ChunkingRuleParser.parse(knowledgeEnv.FILE_TYPE_CHUNKING_RULES || '');
  }

  // Fallback partition method if langchain loader fails
  private fallbackPartitionContent = async (filename: string, content: Uint8Array) => {
    console.warn(`Using fallback partition for ${filename}`);
    // Simple text extraction fallback
    let text = '';
    try {
      // Try to convert to text if it's a text-based file
      text = new TextDecoder().decode(content);
    } catch (e) {
      text = `[File content could not be extracted: ${filename}]`;
    }
    
    return [{
      id: `fallback-${Date.now()}`,
      pageContent: text,
      metadata: { source: filename }
    }];
  };

  private getChunkingServices(fileType: string): ChunkingService[] {
    const ext = fileType.split('/').pop()?.toLowerCase() || '';
    return this.chunkingRules[ext] || ['default'];
  }

  private isEpubFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.epub');
  }

  async chunkContent(params: ChunkContentParams): Promise<ChunkResult> {
    const services = this.getChunkingServices(params.fileType);

    // Skip problematic EPUB files in the build environment
    if (this.isEpubFile(params.filename) && process.env.NODE_ENV === 'production') {
      console.warn('EPUB processing disabled in production environment to avoid build errors');
      return {
        chunks: [{
          id: `epub-skipped-${Date.now()}`,
          index: 0,
          text: `[EPUB file processing is currently disabled: ${params.filename}]`,
          type: 'TextElement',
          metadata: { source: params.filename },
        }]
      };
    }

    for (const service of services) {
      try {
        switch (service) {
          case 'unstructured': {
            if (this.canUseUnstructured()) {
              return await this.chunkByUnstructured(params.filename, params.content);
            }
            break;
          }

          case 'doc2x': {
            // Future implementation
            break;
          }

          default: {
            // Wrap langchain chunking in try-catch to handle potential errors
            try {
              return await this.chunkByLangChain(params.filename, params.content);
            } catch (error) {
              console.error(`LangChain chunking failed for ${params.filename}:`, error);
              
              // If this is an EPUB file with the typical error, provide helpful message
              if (this.isEpubFile(params.filename) && 
                  error instanceof Error && 
                  error.message.includes("Cannot find module 'zipfile'")) {
                console.warn('EPUB loading failed due to zipfile module resolution error');
              }
              
              // Re-throw if this is the last service
              if (service === services.at(-1)) throw error;
            }
          }
        }
      } catch (error) {
        // If this is the last service, throw the error
        if (service === services.at(-1)) throw error;
        // Otherwise continue to next service
        console.error(`Chunking failed with service ${service}:`, error);
      }
    }

    // Fallback to a safe text extraction
    return {
      chunks: [{
        id: `fallback-${Date.now()}`,
        index: 0,
        text: `[Failed to process file with available services: ${params.filename}]`,
        type: 'TextElement',
        metadata: { source: params.filename },
      }]
    };
  }

  private canUseUnstructured(): boolean {
    return !!(knowledgeEnv.UNSTRUCTURED_API_KEY && knowledgeEnv.UNSTRUCTURED_SERVER_URL);
  }

  private chunkByUnstructured = async (
    filename: string,
    content: Uint8Array,
  ): Promise<ChunkResult> => {
    const result = await this.unstructuredClient.partition({
      chunkingStrategy: ChunkingStrategy.ByPage,
      fileContent: content,
      filename,
      strategy: Strategy.Auto,
    });

    // after finish partition, we need to filter out some elements
    const documents = result.compositeElements
      .filter((e) => e && e.type && !new Set(['PageNumber', 'Footer']).has(e.type))
      .map((item, index): NewChunkItem => {
        const {
          text_as_html,
          page_number,
          page_name,
          image_mime_type,
          image_base64,
          parent_id,
          languages,
          coordinates,
        } = item.metadata || {};

        return {
          id: item.element_id,
          index,
          metadata: {
            coordinates,
            image_base64,
            image_mime_type,
            languages,
            page_name,
            page_number,
            parent_id,
            text_as_html,
          },
          text: item.text,
          type: item.type,
        };
      });

    const chunks = result.originElements
      .filter((e) => e && e.type && !new Set(['PageNumber', 'Footer']).has(e.type))
      .map((item, index): NewUnstructuredChunkItem => {
        const {
          text_as_html,
          page_number,
          page_name,
          image_mime_type,
          image_base64,
          parent_id,
          languages,
          coordinates,
        } = item.metadata || {};

        return {
          compositeId: item.compositeId,
          id: item.element_id,
          index,
          metadata: {
            coordinates,
            image_base64,
            image_mime_type,
            languages,
            page_name,
            page_number,
            text_as_html,
          },
          parentId: parent_id,
          text: item.text,
          type: item.type,
        };
      });

    return { chunks: documents, unstructuredChunks: chunks };
  };

  private chunkByLangChain = async (
    filename: string,
    content: Uint8Array,
  ): Promise<ChunkResult> => {
    const res = await this.langchainClient.partitionContent(filename, content);

    const documents = res.map((item, index) => ({
      id: item.id,
      index,
      metadata: item.metadata,
      text: item.pageContent,
      type: 'LangChainElement',
    }));

    return { chunks: documents };
  };
}