import {createAction, props} from '@ngrx/store';
import {UserInterface} from "../../../../../shared/interfaces/user/user.interface";
import {RegisterUserInterface} from "../../../../../shared/interfaces/user/registerUser.interface";

export const registerUser = createAction(
  '[Register User Interface] User Loading',
  props<{ user: RegisterUserInterface }>()
);

export const registerUserSuccess = createAction(
  '[Register User Interface] User created',
  props<{ user: UserInterface }>()
);

export const registerUserError = createAction(
  '[Register User Interface] User error'
);
