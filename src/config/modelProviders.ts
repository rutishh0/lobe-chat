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
