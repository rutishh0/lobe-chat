import { SidebarTabKey } from './initialState';

export const GLOBAL_CONFIG = {
  // Hide all sidebars and panels by default
  showChatSideBar: false,
  showFilePanel: false,
  showSessionPanel: false,
  showSystemRole: false,
  
  // Set chat as the default and only visible tab
  sidebarKey: SidebarTabKey.Chat,
  
  // Enable dark theme
  appearance: 'dark',
  
  // Disable features we want to hide
  hideSettings: true,
  hideDiscover: true,
  hideFiles: true,
  
  // Set chat panel dimensions
  inputHeight: 200,
  portalWidth: 0, // Hide portal
  sessionsWidth: 0, // Hide sessions
};
