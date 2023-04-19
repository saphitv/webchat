import {AuthState} from "../reducers/index.reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUserState = createSelector(selectAuthState, (auth) => auth.user)

export const isLoggedIn = createSelector(selectUserState, (user) => user.id != 0)
export const isLoggedOut = createSelector(isLoggedIn, (isLoggedIn) => !isLoggedIn)

export const selectIsCheckingIfLoggedIn = createSelector(selectAuthState, (auth) => auth.other.isCheckingIfLoggedIn)
