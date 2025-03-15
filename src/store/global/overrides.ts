import { GlobalState, INITIAL_STATUS, SidebarTabKey } from './initialState';

// Override the initial status with simplified UI settings
export const SIMPLIFIED_STATUS = {
  ...INITIAL_STATUS,
  filePanelWidth: 0,
  portalWidth: 0,
  sessionsWidth: 0,
  showChatSideBar: false,
  showFilePanel: false,
  showSessionPanel: false,
  showSystemRole: false,
  zenMode: true,
};

// Create simplified global state
export const simplifiedState: Partial<GlobalState> = {
  sidebarKey: SidebarTabKey.Chat,
  status: SIMPLIFIED_STATUS,
};

// Function to apply simplified UI
export const applySimplifiedUI = (state: GlobalState) => {
  state.status = SIMPLIFIED_STATUS;
  state.sidebarKey = SidebarTabKey.Chat;
  return state;
};
