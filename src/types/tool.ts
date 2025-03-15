export interface ToolStoreItem {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  homepage?: string;
  manifest: {
    identifier: string;
    version: string;
    type: string;
    name: string;
    description: string;
    author: string;
    homepage?: string;
    systemRequirements?: {
      os?: string[];
      arch?: string[];
      node?: string;
    };
  };
  installed: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
