import {ActionReducerMap} from '@ngrx/store';
import {userReducer, UserState} from "./user.reducer";
import {authReducer, AuthStateSub} from "./auth.reducer";

export interface AuthState {
  user: UserState,
  other: AuthStateSub
}






export const reducers: ActionReducerMap<AuthState> = {
  user: userReducer,
  other: authReducer
};
