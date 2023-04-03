import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { RouterState } from '@angular/router';
import {userReducer, UserState} from "./user.reducer";

export interface AuthState {
  user: UserState
}

export const reducers: ActionReducerMap<AuthState> = {
  user: userReducer
};
