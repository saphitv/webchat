import { createReducer, on } from '@ngrx/store';
import {LoginActions} from "../actions/actions-type";
import {UserInterface} from "../../../../shared/interfaces/user/user.interface";
import {extend} from "lodash";

export interface UserState extends UserInterface {}


export const initialCotteState: UserState = {
    id: 0,
    email: '',
    username: 'ANONIMO',
    roles: [''],
};

export const userReducer = createReducer(
  initialCotteState,
  on(LoginActions.userLoggedInSuccess, (state, {user}) => ({...state, ...user})),
  on(LoginActions.loadUserSuccess, (state, {user}) => ({...state, ...user})),
  on(LoginActions.userLoggedOut, (state) => (initialCotteState))
);
