import {createReducer, on} from "@ngrx/store";
import {AuthActions} from "../actions/actions-type";


export interface AuthStateSub {
  isCheckingIfLoggedIn: boolean,
}

export const initialAuthState: any = {
  isCheckingIfLoggedIn: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.startLoadingUser, (state) => ({...state, isCheckingIfLoggedIn: true})),
  on(AuthActions.stopLoadingUser, (state) => ({...state, isCheckingIfLoggedIn: false}))
);
