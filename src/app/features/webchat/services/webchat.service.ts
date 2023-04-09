import {inject, Injectable} from '@angular/core';
import {combineLatest, map, of } from "rxjs";
import {SocketService} from "../../../core/services/socket.service";
import {AppState} from "../../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {AuthSelectors} from "../../auth/store/selectors/selectors-type";
import {WebchatActionsMessage, WebchatActionsUser} from "../store/actions/actions-type";
import {UserInterface} from "../interfaces/user.interface";
import {MessageInterface} from "../interfaces/message.interface";

@Injectable({
  providedIn: 'root'
})
export class WebchatService {

  socketService = inject(SocketService)
  store = inject(Store<AppState>)

  connect() {
    this.socketService.connectToSocket()

    // init user
    const ref = combineLatest([this.socketService.fromEvent<UserInterface[]>("users_init"), this.store.select(AuthSelectors.selectUserState)])
      .pipe(
        map(([users, currentUser]) => {
          return users.map((user: any) => ({self: user.id == currentUser.id, ...user})) as UserInterface[]
        })
      ).subscribe(users => {
        this.store.dispatch(WebchatActionsUser.setUsers(users))
        this.store.dispatch(WebchatActionsUser.loadedUsers(true))
        ref.unsubscribe()
      })

    // user connected
    this.socketService.fromEvent<UserInterface>("user connected").subscribe(newUser => {
      // @ts-ignore
      this.store.dispatch(WebchatActionsUser.connectUser({self: false, ...newUser}))
    })

    // incoming messages
    this.socketService.fromEvent('private message').subscribe((mes: any) => {
      this.store.dispatch(WebchatActionsMessage.serverMessage(mes))
    })

    this.socketService.fromEvent("user disconnected").subscribe((user: any) => {
      this.store.dispatch(WebchatActionsUser.disconnectUser(user.id))
    })
  }


  sendMessage(mes: MessageInterface) {
    if (!mes.from.self) {
      throw new Error("You can't send messages from other users")
    }

    this.socketService.emit("private message", {mes})

    return of(mes)
  }
}
