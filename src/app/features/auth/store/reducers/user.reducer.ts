import { createReducer, on } from '@ngrx/store';
import {LoginActions} from "../actions/actions-type";
import {UserInterface} from "../../../../shared/interfaces/user/user.interface";

export interface UserState extends UserInterface {}


export const initialUserState: UserState = {
    id: 0,
    email: '',
    username: 'ANONIMO',
    roles: [''],
};

export const userReducer = createReducer(
  initialUserState,
  on(LoginActions.userLoggedInSuccess, (state, {user}) => ({...state, ...user})),
  on(LoginActions.loadUserSuccess, (state, {user}) => ({...state, ...user})),
  on(LoginActions.userLoggedOut, (state) => initialUserState)
);
