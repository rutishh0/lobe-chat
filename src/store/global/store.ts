import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type GlobalClientDBAction, clientDBSlice } from './actions/clientDb';
import { type GlobalGeneralAction, generalActionSlice } from './actions/general';
import { type GlobalWorkspacePaneAction, globalWorkspaceSlice } from './actions/workspacePane';
import { type GlobalState, initialState } from './initialState';
import { SIMPLIFIED_STATUS } from './overrides';

//  ===============  Store Creation ============ //

export interface GlobalStore
  extends GlobalState,
    GlobalWorkspacePaneAction,
    GlobalClientDBAction,
    GlobalGeneralAction {
  /* empty */
}

const createStore: StateCreator<GlobalStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  // Override initial state with simplified UI settings
  status: SIMPLIFIED_STATUS,
  // Include all action slices
  ...globalWorkspaceSlice(...parameters),
  ...clientDBSlice(...parameters),
  ...generalActionSlice(...parameters),
});

//  ===============  Store Implementation ============ //

const devtools = createDevtools('global');

export const useGlobalStore = createWithEqualityFn<GlobalStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
