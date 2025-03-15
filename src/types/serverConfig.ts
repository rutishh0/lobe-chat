export interface GlobalServerConfig {
  version: string;
  settings: Record<string, unknown>;
  aiProvider: {
    provider: string;
    apiKey?: string;
    endpoint?: string;
  };
  telemetry: {
    enabled: boolean;
    id?: string;
  };
}
