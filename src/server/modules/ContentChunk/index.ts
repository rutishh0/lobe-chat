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
  private langchainClient: ChunkingLoader | null = null;
  private chunkingRules: Record<string, ChunkingService[]>;

  constructor() {
    this.unstructuredClient = new Unstructured();
    
    // Safely initialize LangChain loader
    try {
      // Only initialize LangChain loader if not in a build context
      if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
        this.langchainClient = new ChunkingLoader();
      } else {
        console.warn('LangChain loader not initialized in build environment');
      }
    } catch (error) {
      console.warn('LangChain loader initialization failed:', error);
      this.langchainClient = null;
    }
    
    this.chunkingRules = ChunkingRuleParser.parse(knowledgeEnv.FILE_TYPE_CHUNKING_RULES || '');
  }

  private getChunkingServices(fileType: string): ChunkingService[] {
    const ext = fileType.split('/').pop()?.toLowerCase() || '';
    return this.chunkingRules[ext] || ['default'];
  }

  async chunkContent(params: ChunkContentParams): Promise<ChunkResult> {
    const services = this.getChunkingServices(params.fileType);
    const fileExt = params.filename.split('.').pop()?.toLowerCase();
    
    // Special handling for problematic file types
    if (fileExt === 'epub') {
      console.warn('EPUB processing is currently disabled');
      return {
        chunks: [{
          id: `epub-${Date.now()}`,
          index: 0,
          text: `[This EPUB file was not processed: ${params.filename}]`,
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
            if (this.langchainClient) {
              return await this.chunkByLangChain(params.filename, params.content);
            } else {
              console.warn('LangChain loader not available, falling back to basic text extraction');
              return this.extractBasicText(params.filename, params.content);
            }
          }
        }
      } catch (error) {
        // If this is the last service, throw the error (unless we're in a production build)
        if (service === services.at(-1)) {
          if (process.env.NODE_ENV === 'production') {
            console.error(`All chunking services failed for ${params.filename}:`, error);
            return this.extractBasicText(params.filename, params.content);
          } else {
            throw error;
          }
        }
        // Otherwise continue to next service
        console.error(`Chunking failed with service ${service}:`, error);
      }
    }

    // Fallback to basic text extraction
    return this.extractBasicText(params.filename, params.content);
  }

  private extractBasicText(filename: string, content: Uint8Array): ChunkResult {
    let text = '';
    try {
      // Try to convert to text if it's a text-based file
      text = new TextDecoder().decode(content);
    } catch (e) {
      text = `[Content could not be extracted from ${filename}]`;
    }
    
    return {
      chunks: [{
        id: `text-${Date.now()}`,
        index: 0,
        text: text.length > 0 ? text : `[No text content in ${filename}]`,
        type: 'TextElement',
        metadata: { source: filename },
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

    // Safely filter and map composite elements
    const documents = Array.isArray(result.compositeElements) 
      ? result.compositeElements
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
              id: item.element_id || `element-${index}`,
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
              text: item.text || '',
              type: item.type || 'TextElement',
            };
          })
      : [];

    // Safely filter and map origin elements
    const chunks = Array.isArray(result.originElements)
      ? result.originElements
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
              compositeId: item.compositeId || '',
              id: item.element_id || `origin-${index}`,
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
              text: item.text || '',
              type: item.type || 'TextElement',
            };
          })
      : [];

    return { chunks: documents, unstructuredChunks: chunks };
  };

  private chunkByLangChain = async (
    filename: string,
    content: Uint8Array,
  ): Promise<ChunkResult> => {
    if (!this.langchainClient) {
      throw new Error('LangChain client not initialized');
    }
    
    const res = await this.langchainClient.partitionContent(filename, content);

    const documents = Array.isArray(res) 
      ? res.map((item, index) => ({
          id: item.id || `langchain-${index}`,
          index,
          metadata: item.metadata || { source: filename },
          text: item.pageContent || '',
          type: 'LangChainElement',
        }))
      : [];

    return { chunks: documents };
  };
}