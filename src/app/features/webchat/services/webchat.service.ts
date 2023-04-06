import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, Observable, Subject, tap} from "rxjs";
import {SocketService} from "../../../core/services/socket.service";
import {AuthService} from "../../auth/services/auth.service";
import {AppState} from "../../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {AuthSelectors} from "../../auth/store/selectors/selectors-type";
import {WebchatActions} from "../store/actions/actions-type";
import {UserInterface} from "../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class WebchatService {

  /*userToChatWith: BehaviorSubject<string> = new BehaviorSubject<string>('')

  userChats: BehaviorSubject<{name: string}[]> = new BehaviorSubject<{name: string}[]>([{name: "test1"}, {name: "test2"}, {name: "test3"}])

  messages: BehaviorSubject<{to: string, from: string, type: string, cnt: string, sendTime?: any}[]> =
  new BehaviorSubject<any>(
    [
        {chatId: 1, to: "test", from: "test1", type: "message", cnt: "Ciao come stai?"},
        {chatId: 2, to: "test1", from: "test", type: "message", cnt: "Bene te?"},
        {chatId: 3, to: "test", from: "test2", type: "message", cnt: "Hello"}
    ])

  users$: BehaviorSubject<any> = new BehaviorSubject<any>([])*/

  constructor(private socket: SocketService, private auth: AuthService, private store: Store<AppState>) {}

  getMessageFromChat(userChat: string) {
    //return this.messages.pipe(map(mes => mes.filter(m => m.from == userChat || m.to == userChat)))
  }

  sendMessageTo(type: string, cnt: string, to: string){
    /*let mes = this.messages.value
    let userToChatWith = this.users$.value.filter((user: any) => user.username == this.userToChatWith.value)[0]

    this.messages.next([...mes, {to, cnt, type, from: "saphitv"}])

    this.socket.emit("private message", {
      chatId: 0,
      toSocket: userToChatWith.socketId,
      to: this.userToChatWith.value,
      type: "message",
      cnt: cnt,
      from: "saphitv"
    })*/

  }

  connect() {
    this.socket.connectToSocket()
    console.log("test")

    // init user
    const ref = combineLatest([this.socket.fromEvent<UserInterface[]>("users_init"), this.store.select(AuthSelectors.selectUserState)])
      .pipe(
        map(([users, currentUser]) => {
          return users.map((user: any) => ({self: user.id == currentUser.id, ...user})) as UserInterface[]
        })
      ).subscribe(users => {
        this.store.dispatch(WebchatActions.setUsers(users))
        ref.unsubscribe()
      })

    // user connected
    this.socket.fromEvent<UserInterface>("user connected").subscribe(newUser => {
      // @ts-ignore
      this.store.dispatch(WebchatActions.connectUser({self: false, ...newUser}))
    })

    // incoming messages
    /*this.socket.fromEvent('private message').subscribe((mes: any) => {
      let m = this.messages.value
      //console.log("message", mes)

      this.messages.next([...m, {to: mes.to, cnt: mes.cnt, type: mes.type, from: "test"}])
    })*/

    this.socket.fromEvent("user disconnected").subscribe((user: any) => {
      this.store.dispatch(WebchatActions.disconnectUser(user.id))
    })
  }
}
