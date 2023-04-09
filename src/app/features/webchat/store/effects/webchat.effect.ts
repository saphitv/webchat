import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, concatMap, map, Observable, of, tap} from 'rxjs';
import {Router} from "@angular/router";
import {WebchatActionsMessage, WebchatActionsUser} from "../actions/actions-type";
import {WebchatService} from "../../services/webchat.service";
import {MessageInterface} from "../../interfaces/message.interface";

@Injectable()
export class WebchatEffect {
  actions$ = inject(Actions)
  router = inject(Router)
  webchatService = inject(WebchatService)

  setCurrentChat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsUser.setCurrentChat),
        tap((action) => this.router.navigateByUrl('webchat/' + action.user.username)),
        catchError(_ => {
          console.log("Errore nel routing verso la chat")
          return of()
        })
      ),
    { dispatch: false }
  );

  sendMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(WebchatActionsMessage.sendMessage),
        tap((action) => console.log("Invio messaggio: ", action.message)),
        concatMap((action) => this.webchatService.sendMessage(action.message)),
        map((message) => WebchatActionsMessage.sendMessageSuccess(message)),
        catchError((err: any, caught: Observable<{ message: MessageInterface }>): Observable<any> => {
            console.log("Errore nell'invio del messaggio")

            return caught.pipe(
              map((m) => WebchatActionsMessage.sendMessageError(m.message))
            )
          },
        ));
    },
    { dispatch: true });

  receiveMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(WebchatActionsMessage.serverMessage),
        map(action => WebchatActionsMessage.receiveMessage(action.message)),
        catchError((err: any, caught: Observable<{ message: MessageInterface }>): Observable<any> => {
            console.log("Errore nella ricezione del messaggio")

            return caught.pipe(
              map((_) => WebchatActionsMessage.receiveMessageError())
            )
        })
      )
    })
}
