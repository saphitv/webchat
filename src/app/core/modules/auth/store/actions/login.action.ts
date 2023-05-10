import {createAction, props} from '@ngrx/store';
import {UserInterface} from "../../../../../shared/interfaces/user/user.interface";
import {LoginUserInterface} from "../../../../../shared/interfaces/user/loginUser.interface";

export const loadUser = createAction(
  '[Auth Service] Load User'
);

export const loadUserSuccess = createAction(
  '[Auth Effect] Load User Success',
  props<{ user: UserInterface }>()
);


export const loadUserError = createAction(
  '[Auth Effect] Load User Error'
);


export const userLoggedIn = createAction(
  '[Auth Service] User loggedIn',
  props<{ user: LoginUserInterface }>()
);

export const userLoggedInSuccess = createAction(
  '[Auth Effect] User loggedIn Success',
  props<{ user: UserInterface }>()
);

export const userLoggedInError = createAction(
  '[Auth Effect] User loggedIn Error',
);

export const userLoggedOut = createAction(
  '[Sidebar LoggedOut] User logged Out',
);
