import type { ToolStoreItem } from '../types/tool';

export const DEFAULT_TOOL_STORE_DATA: ToolStoreItem[] = [];

export const TOOL_STORE_KEY = 'toolStore';

export const TOOL_MANIFEST_FILENAME = 'manifest.json';

export const SUPPORTED_TOOL_TYPES = ['plugin', 'theme', 'language'] as const;

export type SupportedToolType = typeof SUPPORTED_TOOL_TYPES[number];

export const isValidToolType = (type: string): type is SupportedToolType => {
  return SUPPORTED_TOOL_TYPES.includes(type as SupportedToolType);
};
