import {createAction, props} from "@ngrx/store";
import {create} from "lodash";
import {sidebarItem} from "../../interfaces/sidebar-item.interface";

export const setTheme = createAction(
  '[Sidebar] Theme Changed',
  props<{ theme: 'light' | 'dark' }>()
);

export const toogleTheme = createAction(
  '[Sidebar] Theme Toggled'
);

export const toggleSidebar = createAction(
  '[Sidebar] Sidebar Toggled'
)

export const setSidebarStatus = createAction(
  '[Sidebar] Sidebar Status Changed',
  props<{ sidebarStatus: 'open' | 'close' }>()
)

// set the sidebar items
export const setSidebarItems = createAction(
  '[Sidebar] Sidebar Items Changed',
  props<{ sidebarItems: sidebarItem[] }>()
)
