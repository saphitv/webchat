import {ActionReducer, createReducer, on} from '@ngrx/store';
import {CoreActions} from "../actions/actions-type";
import {sidebarItem} from "../../interfaces/sidebar-item.interface";

export interface CoreState {
  sidebar: {
    open: boolean,
    items: sidebarItem[]
  },
  theme: 'light' | 'dark'
}
export const initialCoreState: CoreState = {
  sidebar: {
    open: false,
    items: []
  },
  theme: "dark",
};

// create the action reducer with the CoreState interface and the initial state
export const CoreReducer: ActionReducer<CoreState> = createReducer(
  initialCoreState,
  on(CoreActions.toggleSidebar, (state) => ({ ...state, sidebar: { ...state.sidebar, open: !state.sidebar.open } })),
  on(CoreActions.setTheme, (state, { theme }) =>  ({ ...state, theme })),
  on(CoreActions.toogleTheme, (state) => ({ ...state, theme: state.theme === 'light' ? 'dark' : 'light' })),
  on(CoreActions.setSidebarStatus, (state, { sidebarStatus }) => ({ ...state, sidebar: { ...state.sidebar, open: sidebarStatus === 'open' } })),
  on(CoreActions.setSidebarItems, (state, { sidebarItems }) => ({ ...state, sidebar: { ...state.sidebar, items: sidebarItems } }))
);

