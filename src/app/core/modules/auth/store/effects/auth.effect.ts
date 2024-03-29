import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, mergeMap, of, tap} from 'rxjs';
import {AuthActions, LoginActions} from "../actions/actions-type";
import {AuthService} from "../../services/auth.service";
import {Store} from "@ngrx/store";

@Injectable()
export class AuthEffects {
  store = inject(Store)


  loadUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loadUser),
        tap((_) => {
          this.store.dispatch(AuthActions.startLoadingUser())
        }),
        concatMap((_) => this.auth.checkIfJwtValid()),
        map((user) => LoginActions.loadUserSuccess({user})),
        catchError(_ => {
          console.log("Errore nel caricare un utente")
          this.store.dispatch(AuthActions.stopLoadingUser())
          return of(LoginActions.loadUserError())
        })
      ),
    { dispatch: true }
  );

  loadUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loadUserSuccess),
        tap((_) => {
          this.store.dispatch(AuthActions.stopLoadingUser())
        }),
      ), {dispatch: false})

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.userLoggedIn),
        mergeMap((action) =>
          this.auth.login(action.user)
            .pipe(
              map(user => LoginActions.userLoggedInSuccess({user})),
              catchError(_ => {
                console.log("Errore nel login")
                return of(LoginActions.userLoggedInError())
              })
            )
        ),
      ),
    { dispatch: true }
  );

  constructor(private actions$: Actions, private auth: AuthService) {}
}
