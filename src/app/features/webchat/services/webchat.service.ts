import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, Observable, Subject} from "rxjs";
import {SocketService} from "../../../services/socket.service";
import {AuthService} from "../../../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class WebchatService {

  userToChatWith: BehaviorSubject<string> = new BehaviorSubject<string>('')

  userChats: BehaviorSubject<{name: string}[]> = new BehaviorSubject<{name: string}[]>([{name: "test1"}, {name: "test2"}, {name: "test3"}])

  messages: BehaviorSubject<{to: string, from: string, type: string, cnt: string, sendTime?: any}[]> =
  new BehaviorSubject<any>(
    [
        {chatId: 1, to: "test", from: "test1", type: "message", cnt: "Ciao come stai?"},
        {chatId: 2, to: "test1", from: "test", type: "message", cnt: "Bene te?"},
        {chatId: 3, to: "test", from: "test2", type: "message", cnt: "Hello"}
    ])

  users$: BehaviorSubject<any> = new BehaviorSubject<any>([])

  constructor(private socket: SocketService, private auth: AuthService) {
    this.socket.connectToSocket()

    // init user
     combineLatest([this.socket.fromEvent<any>("users"), this.auth.user$])
      .pipe(
        map(([users, currentUser]) => {
          return users.map((user: any) => ({self: user.userId == currentUser.id, ...user}))
        })
      ).subscribe(users => this.users$.next(users))

    // user connected
    this.socket.fromEvent("user connected").subscribe(newUser => {
      console.log(this.users$.value)
      this.users$.next([newUser, ...this.users$.value])
    })

    // incoming messages
    this.socket.fromEvent('private message').subscribe((mes: any) => {
      let m = this.messages.value
      console.log("message", mes)

      this.messages.next([...m, {to: mes.to, cnt: mes.cnt, type: mes.type, from: "test"}])
    })
  }

  getMessageFromChat(userChat: string) {
    return this.messages.pipe(map(mes => mes.filter(m => m.from == userChat || m.to == userChat)))
  }

  sendMessageTo(type: string, cnt: string, to: string){
    let mes = this.messages.value
    let userToChatWith = this.users$.value.filter((user: any) => user.username == this.userToChatWith.value)[0]

    this.messages.next([...mes, {to, cnt, type, from: "saphitv"}])

    this.socket.emit("private message", {
      chatId: 0,
      toSocket: userToChatWith.socketId,
      to: this.userToChatWith.value,
      type: "message",
      cnt: cnt,
      from: "saphitv"
    })

  }
}
