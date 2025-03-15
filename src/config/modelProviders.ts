import type { ModelProvider } from '@/types/modelProvider';

export const DEFAULT_MODEL_PROVIDER_LIST: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com',
    description: 'OpenAI API provider',
    supported_models: ['gpt-3.5-turbo', 'gpt-4'],
    settings: {
      apiKey: '',
      endpoint: 'https://api.openai.com/v1',
    },
    enabled: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    url: 'https://anthropic.com',
    description: 'Anthropic API provider',
    supported_models: ['claude-2', 'claude-instant'],
    settings: {
      apiKey: '',
    },
    enabled: false,
  },
];

// Default model list that was missing
export const LOBE_DEFAULT_MODEL_LIST = [
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
];

// Utility functions that were missing
export const isProviderDisableBrowserRequest = (provider: string) => {
  const disabledProviders = ['ollama', 'local'];
  return disabledProviders.includes(provider.toLowerCase());
};

export const filterEnabledModels = (models: any[]) => {
  return models.filter(model => model.enabled !== false);
};

// Provider Cards that were missing
export const OpenAIProviderCard = { id: 'openai', name: 'OpenAI' };
export const AzureProviderCard = { id: 'azure', name: 'Azure OpenAI' };
export const AzureAIProviderCard = { id: 'azureai', name: 'Azure AI' };
export const AnthropicProviderCard = { id: 'anthropic', name: 'Anthropic' };
export const GoogleProviderCard = { id: 'google', name: 'Google AI' };
export const BedrockProviderCard = { id: 'bedrock', name: 'AWS Bedrock' };
export const CloudflareProviderCard = { id: 'cloudflare', name: 'Cloudflare Workers AI' };
export const GithubProviderCard = { id: 'github', name: 'GitHub Copilot' };
export const HuggingFaceProviderCard = { id: 'huggingface', name: 'Hugging Face' };
export const OllamaProviderCard = { id: 'ollama', name: 'Ollama' };
export const VertexAIProviderCard = { id: 'vertexai', name: 'Vertex AI' };
export const VLLMProviderCard = { id: 'vllm', name: 'vLLM' };
export const DeepSeekProviderCard = { id: 'deepseek', name: 'DeepSeek' };
export const OpenRouterProviderCard = { id: 'openrouter', name: 'OpenRouter' };
export const NovitaProviderCard = { id: 'novita', name: 'Novita AI' };
export const TogetherAIProviderCard = { id: 'togetherai', name: 'Together AI' };
export const FireworksAIProviderCard = { id: 'fireworksai', name: 'Fireworks AI' };
export const GroqProviderCard = { id: 'groq', name: 'Groq' };
export const NvidiaProviderCard = { id: 'nvidia', name: 'NVIDIA AI' };
export const PerplexityProviderCard = { id: 'perplexity', name: 'Perplexity AI' };
export const MistralProviderCard = { id: 'mistral', name: 'Mistral AI' };
export const Ai21ProviderCard = { id: 'ai21', name: 'AI21 Labs' };
export const UpstageProviderCard = { id: 'upstage', name: 'Upstage' };
export const XAIProviderCard = { id: 'xai', name: 'xAI' };
export const JinaProviderCard = { id: 'jina', name: 'Jina AI' };
export const SambaNovaProviderCard = { id: 'sambanova', name: 'SambaNova' };
export const QwenProviderCard = { id: 'qwen', name: 'Qwen' };
export const WenxinProviderCard = { id: 'wenxin', name: 'Wenxin' };
export const HunyuanProviderCard = { id: 'hunyuan', name: 'Hunyuan' };
export const SparkProviderCard = { id: 'spark', name: 'Spark' };
export const ZhiPuProviderCard = { id: 'zhipu', name: 'ZhiPu' };
export const ZeroOneProviderCard = { id: 'zeroone', name: 'Zero One' };
export const SenseNovaProviderCard = { id: 'sensenova', name: 'SenseNova' };
export const StepfunProviderCard = { id: 'stepfun', name: 'Stepfun' };
export const MoonshotProviderCard = { id: 'moonshot', name: 'Moonshot AI' };
export const BaichuanProviderCard = { id: 'baichuan', name: 'Baichuan' };
export const MinimaxProviderCard = { id: 'minimax', name: 'MiniMax' };
export const Ai360ProviderCard = { id: 'ai360', name: 'AI360' };
export const TaichuProviderCard = { id: 'taichu', name: 'Taichu' };
export const InternLMProviderCard = { id: 'internlm', name: 'InternLM' };
export const SiliconCloudProviderCard = { id: 'siliconcloud', name: 'Silicon Cloud' };
export const HigressProviderCard = { id: 'higress', name: 'Higress' };
export const GiteeAIProviderCard = { id: 'giteeai', name: 'Gitee AI' };
export const PPIOProviderCard = { id: 'ppio', name: 'PPIO' };
export const DoubaoProviderCard = { id: 'doubao', name: 'Doubao' };