import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, concatMap, map, of, tap} from 'rxjs';
import {LoginActions} from "../actions/actions-type";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthEffects {
  loadUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loadUser),
        concatMap((_) => this.auth.checkIfJwtValid()),
        map((user) => LoginActions.loadUserSuccess({user})),
        catchError(_ => {
          console.log("Errore nel caricare un utente")
          return of(LoginActions.loadUserError())
        })
      ),
    { dispatch: true }
  );

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.userLoggedIn),
        concatMap((action) => this.auth.login(action.user)),
        map(user => LoginActions.userLoggedInSuccess({user})),
        catchError(_ => {
          console.log("Errore nel caricare un utente")
          return of(LoginActions.userLoggedInError())
        })
      ),
    { dispatch: true }
  );

  constructor(private actions$: Actions, private auth: AuthService, private router: Router) {}
}
