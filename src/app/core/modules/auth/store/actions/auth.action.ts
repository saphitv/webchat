import {createAction} from "@ngrx/store";

export const startLoadingUser = createAction(
  '[Auth Service] Start Loading User'
);

export const stopLoadingUser = createAction(
  '[Auth Service] Stop Loading User'
);
