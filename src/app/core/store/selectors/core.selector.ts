import {CoreState} from "../reducers/index.reducers";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthSelectors} from "../../../features/auth/store/selectors/selectors-type";

const featureSelector = createFeatureSelector<CoreState>('core');

export const selectTheme =  createSelector(featureSelector, (state: CoreState) => state.theme);

export const selectSidebar = createSelector(featureSelector, (state: CoreState) => state.sidebar)


export const isSidebarOpen = createSelector(selectSidebar, (sidebar) => sidebar.open)

export const selectSidebarItems = createSelector(selectSidebar, (sidebar) => sidebar.items);

export const selectSidebarItemToDisplay = createSelector(selectSidebarItems, AuthSelectors.isLoggedIn,  (sidebarItems, isLoggedIn) =>
  sidebarItems.filter(i => i.show == "LOGGED" && isLoggedIn || i.show == "UNLOGGED" && !isLoggedIn)
);
