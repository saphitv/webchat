import {inject, Injectable} from '@angular/core';
import {combineLatest, filter, from, map, Observable, of, switchMap} from "rxjs";
import {SocketService} from "../../../core/services/socket.service";
import {AppState} from "../../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {WebchatActionsChat, WebchatActionsMessage} from "../store/actions/actions-type";
import {UserInterface} from "../interfaces/user.interface";
import {MessageInterface} from "../interfaces/message.interface";
import {HttpClient} from "@angular/common/http";
import {ChatInterface} from "../interfaces/chat.interface";
import {WebchatSelectors} from "../store/selectors/selectors-type";

@Injectable({
  providedIn: 'root'
})
export class WebchatService {

  socketService = inject(SocketService)
  store = inject(Store<AppState>)
  http = inject(HttpClient)

  connect() {
    this.socketService.connectToSocket()
    this.store.dispatch(WebchatActionsChat.setSocketConnected(this.socketService.isConnected.value))




    // init users
    this.store.dispatch(WebchatActionsChat.loadUsers())

    const ref = this.store.select(WebchatSelectors.areUsersLoaded).pipe(filter(areUsersLoaded => areUsersLoaded)).subscribe(areUsersLoaded => {
      this.store.dispatch(WebchatActionsChat.loadChats())
      setTimeout(() => {
        ref.unsubscribe()
      }, 10);
    })

    const ref1 = this.store.select(WebchatSelectors.selectChats)
      .pipe(
        filter(chats => chats.length > 0),
        map(chats => chats.map(chat => chat.id))
      ).subscribe(chats => {
        this.socketService.emit("connect to chats", {chats})
      })

    // const ref = this.store.select(AuthSelectors.selectUserState)
    //   .pipe(
    //     switchMap(user => {
    //       return this.http.post<ChatInterface[]>("/api/webchat/chats/", {test: "test"})
    //     }),
    //     /* map((res: any) => {
    //       return res.map((user: any) => ({self: false, ...user})) as UserInterface[]
    //     })*/
    //   )
    //   .subscribe(chats => {
    //     this.store.dispatch(WebchatActionsUser.setChats(chats))
    //     this.store.dispatch(WebchatActionsUser.loadedDB(true))
    //     ref.unsubscribe()
    // })

    // init user
    // const ref = combineLatest([this.socketService.fromEvent<UserInterface[]>("users_init"), this.store.select(AuthSelectors.selectUserState)])
    //   .pipe(
    //     map(([users, currentUser]) => {
    //       return users.map((user: any) => ({self: user.id == currentUser.id, ...user})) as UserInterface[]
    //     })
    //   ).subscribe(users => {
    //     //this.store.dispatch(WebchatActionsUser.setUsers(users))
    //     // this.store.dispatch(WebchatActionsUser.loadedUsers(true))
    //     ref.unsubscribe()
    //   })

    // user connected
    this.socketService.fromEvent<UserInterface>("user connected").subscribe(newUser => {
      // @ts-ignore
      // this.store.dispatch(WebchatActionsUser.connectUser({self: false, ...newUser}))
    })

    // incoming messages
    this.socketService.fromEvent('private message').subscribe((mes: any) => {
      console.log("incoming message", mes)
      this.store.dispatch(WebchatActionsMessage.serverMessage(mes))
    })

    /* this.socketService.fromEvent("user disconnected").subscribe((user: any) => {
      this.store.dispatch(WebchatActionsUser.disconnectUser(user.id))
    }) */
  }


  sendMessage(mes: MessageInterface) {
    /* if (!mes.from.self) {
      throw new Error("You can't send messages from other users")
    } */

    const ref = this.http.post("/api/webchat/chat/send", mes).subscribe(() => ref.unsubscribe())
    this.socketService.emit("private message", {mes})

    return of(mes)
  }

  getUsers(): Observable<UserInterface[]> {
    return this.http.post<UserInterface[]>("/api/webchat/friends/", {scope: "loading users"})
  }

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.post<UserInterface[]>("/api/webchat/friends/all/", {scope: "loading all users"})
  }

  getChats(): Observable<ChatInterface[]> {
    return this.http.post<ChatInterface[]>("/api/webchat/chats/", {scope: "loading chats"})
  }

  getLastMessage(chats: number[]): Observable<MessageInterface> {
    return this.http.post<MessageInterface[]>("/api/webchat/message/last/", {chats})
      .pipe(
        switchMap((messages: MessageInterface[]) =>
          from(messages)
      ),
      switchMap(message =>
        combineLatest([of(message), this.store.select(WebchatSelectors.selectUsers)])
      ),
      map(([message, users]) => {
        return { ...message, from: users.find((user: UserInterface) => user.id == (message.from as any as number)) } as MessageInterface
      })
    )
  }

  getMessages(chatId: number): Observable<MessageInterface[]> {
    return this.http.post<MessageInterface[]>("/api/webchat/message/", {chatId})
      .pipe(
        switchMap(messages =>
          combineLatest([of(messages), this.store.select(WebchatSelectors.selectUsers)])
        ),
        map(([messages, users]) => {
          return messages.map(message => ({
            ...message,
            from: users.find((user: UserInterface) => user.id == (message.from as any as number))
          } as MessageInterface))
        }),
      )
  }

  createChat(users: number[]): Observable<ChatInterface> {
    return this.http.post<ChatInterface>("/api/webchat/chat/create/", {users})
  }

  joinChat(chatIds: number[]): void {
    this.socketService.emit("connect to chats", {chats: chatIds})
  }

  deleteChat(chatId: number): Observable<number> {
    return this.http.post("/api/webchat/chat/delete/", {chatId})
      .pipe(
        map(() => chatId)
      )
  }

  leaveChat(chatId: number): void {
    this.socketService.emit("leave chat", {chatId})
  }

  renameChat(chatId: number, name: string): Observable<{ chatId: number, name: string }> {
    return this.http.post<ChatInterface>("/api/webchat/chat/rename/", {chatId, name})
      .pipe(
        map(() => ({
          chatId,
          name
        }))
      )
  }
}
