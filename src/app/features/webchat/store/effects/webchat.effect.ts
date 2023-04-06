import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, concatMap, map, of, tap} from 'rxjs';
import {Router} from "@angular/router";
import {WebchatActions} from "../actions/actions-type";

@Injectable()
export class WebchatEffect {
  setCurrentChat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActions.setCurrentChat),
        tap((action) => this.router.navigateByUrl('webchat/' + action.user.username)),
        catchError(_ => {
          console.log("Errore nel routing verso la chat")
          return of()
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
