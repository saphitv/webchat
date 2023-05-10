import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  catchError,
  combineLatest,
  concat,
  concatMap,
  map,
  MonoTypeOperatorFunction,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  takeWhile,
  tap
} from 'rxjs';
import {Router} from "@angular/router";
import {WebchatActionsChat, WebchatActionsMessage, WebchatActionsUser} from "../actions/actions-type";
import {WebchatService} from "../../services/webchat.service";
import {MessageInterface} from "../../interfaces/message.interface";
import {ChatInterface} from "../../interfaces/chat.interface";
import {WebchatSelectors} from "../selectors/selectors-type";
import {Store} from "@ngrx/store";
import {WebchatState} from "../reducers/index.reducer";
import {AuthSelectors} from "../../../../core/modules/auth/store/selectors/selectors-type";
import {UserInterface} from "../../interfaces/user.interface";

@Injectable()
export class WebchatEffect {
  actions$ = inject(Actions)
  router = inject(Router)
  webchatService = inject(WebchatService)
  store = inject(Store<WebchatState>)

  loadUsers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsChat.loadUsers),
        concatMap(() => this.webchatService.getUsers()),
        map((users) => WebchatActionsChat.loadUsersSuccess(users)),
        catchError((err: any, caught: Observable<{ users: any[] }>): Observable<any> => {
          console.log("Errore nel caricamento degli utenti")

          return caught.pipe(
            map((m) => WebchatActionsChat.loadUsersFailure(m))
          )
        })
      ))

  loadAllUsers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsChat.loadAllUsers),
        concatMap(() => this.webchatService.getAllUsers()),
        map((users) => WebchatActionsChat.loadAllUsersSuccess(users)),
        catchError((err: any, caught: Observable<{ users: any[] }>): Observable<any> => {
          console.log("Errore nel caricamento degli utenti")

          return caught.pipe(
            map((m) => WebchatActionsChat.loadAllUsersFailure(m))
          )
        })
      ))

  loadChats$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsChat.loadChats),
        concatMap(() => combineLatest([
          this.webchatService.getChats(),
          this.store.select(WebchatSelectors.selectUsers),
          this.store.select(AuthSelectors.selectUserState)
        ])),


        // separa gli utenti in un array
        map(([chats, users, userAuth]) =>
          ({
            chats: chats.map((chat) => ({...chat, users: (chat.users as any as string).split(":")})) as any as ChatInterface[],
            users: users.map(user => ({...user, self: user.id == userAuth.id})) as any as UserInterface[]
          })
        ),


        // imposta il nome delle chat private
        map(({chats, users}) =>
          chats.map((chat: ChatInterface) => (
            {
              ...chat,
              name: chat.name ? chat.name : users.filter(user => !user.self).find(user => chat.users.includes(user.id.toString() as any))?.username,
              messageLoaded: false
            }))
        ),



        tap(chats => {
            const chatsId = chats.map(chat => chat.id)

            if (chatsId.length > 0)
              this.webchatService.getLastMessage(chatsId)
                .subscribe((message: MessageInterface) => {
                  // console.log("Ricevuto messaggio: ", message)
                  this.store.dispatch(WebchatActionsMessage.receiveMessage(message))
                })
          }
        ),

        map((chats) => WebchatActionsChat.loadChatsSuccess(chats)),


        catchError((err: any, caught: Observable<{ chats: any[] }>): Observable<any> => {
          console.log("Errore nel caricamento delle chat")

          return caught.pipe(
            map((m) => WebchatActionsChat.loadChatsFailure(m))
          )
        })
      ))

  loadChatMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsMessage.loadChatMessages),
        switchMap((action) => combineLatest([
          this.webchatService.getMessages(action.chatId),
          of(action.chatId)
        ])),
        map(([messages, chatId]) => WebchatActionsMessage.loadChatMessagesSuccess({messages, chatId}))
      )
  )

  setCurrentChat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsUser.setCurrentChat),
        // TODO: #8
        /* tap((action) => this.router.navigateByUrl('webchat/' + action.user.username)), */
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

  createChat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsChat.createChat),
        concatMap((action) => this.webchatService.createChat(action.users)),
        map((chat) => WebchatActionsChat.createChatRequest({chat})),
        catchError((err: any, caught: Observable<{ chat: ChatInterface }>): Observable<any> => {
          console.log("Errore nella creazione della chat")

          return caught.pipe(
            map((_) => WebchatActionsChat.createChatFailure(err))
          )
        })
      ),
    {dispatch: true}
  )

  // @ts-ignore
  createChatSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebchatActionsChat.createChatRequest),
        // load eventual new user for the name
        tap(_ => {
          this.store.dispatch(WebchatActionsChat.setUsersLoaded({loaded: false}))
          this.store.dispatch(WebchatActionsChat.loadAllUsers())
        }),

        map((action: any) => (action.chat as ChatInterface)),

        tap((chat: any) => {
          this.store.dispatch(WebchatActionsUser.setCurrentChat({chat: chat}))
          this.webchatService.joinChat([chat.id])
        }),

        concatMap((chat) => combineLatest([
          of(chat),
          this.store.select(WebchatSelectors.selectUsers),
          this.store.select(AuthSelectors.selectUserState)
        ])),

        // separa gli utenti in un array
        map(([chat, users, userAuth]) =>
          ({
            chat: {...chat, users: (chat.users as any as string).split(":") as any as number[]} as ChatInterface,
            users: users.map(user => ({...user, self: user.id == userAuth.id})) as any as UserInterface[]
          })
        ),


        // imposta il nome delle chat private
        map(({chat, users}) =>
          ({
            ...chat,
            name: chat.name ? chat.name : users.filter(user => !user.self).find(user => chat.users.includes(user.id.toString() as any))?.username,
            messageLoaded: true
          })
        ),
        map((chat) => WebchatActionsChat.createChatSuccess({chat})),
        catchError(_ => {
          console.log("Errore nel routing verso la chat")
          return of()
        }),
      ),
    {dispatch: true}
  );

  waitUntil<T>(notifier$: Observable<any>): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) => {
      const buffer$ = new ReplaySubject<T>();
      let doBuffer = true;
      source$.pipe(takeWhile(() => doBuffer, true)).subscribe(buffer$);
      return notifier$.pipe(
        take(1),
        switchMap(() => {
          doBuffer = false;
          return concat(buffer$, source$);
        }),
      );
    };
  }
}
