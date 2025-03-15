export interface ModelProvider {
  id: string;
  name: string;
  url?: string;
  description?: string;
  supported_models: string[];
  settings?: {
    apiKey?: string;
    endpoint?: string;
    [key: string]: unknown;
  };
  enabled: boolean;
}
