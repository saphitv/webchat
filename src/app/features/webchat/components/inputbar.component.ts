import {Component, inject, Input} from '@angular/core';
import {WebchatService} from "../services/webchat.service";
import {UserInterface} from "../interfaces/user.interface";
import {MessageInterface, SendStatus} from "../interfaces/message.interface";
import {WebchatSelectors} from "../store/selectors/selectors-type";
import {AuthSelectors} from "../../auth/store/selectors/selectors-type";
import {AppState} from "../../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {combineLatest, filter, first, map} from "rxjs";
import {WebchatActionsMessage} from "../store/actions/actions-type";

@Component({
  selector: 'app-inputbar',
  template: `
    <div class="w-full h-16 pr-4 p-2 flex justify-between">
      <input #textInputMessage (keyup.enter)="sendMessage(textInputMessage)" type="text" placeholder="Type here" class="input input-bordered min-w-48 w-[95%] h-full" />
      <div class="flex items-center">
        <svg (click)="sendMessage(textInputMessage)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>


    </div>
  `,
  styles: [
  ]
})
export class InputbarComponent {
  @Input() scrollToBottom!: (cnt: HTMLDivElement) => void
  @Input() cnt!: HTMLDivElement

  webchatService = inject(WebchatService)
  store = inject(Store<AppState>)


  // get from the store the current user  and the user authenticated
  messageInformation$ = combineLatest(
    [this.store.select(WebchatSelectors.selectCurrentChat), this.store.select(AuthSelectors.selectUserState), this.store.select(WebchatSelectors.selectUsers)]
  ).pipe(
    filter(([userToChatWith, userAuthenticated, users]) => userToChatWith != null && userAuthenticated != null && users.length > 0),
    map(
      ([userToChatWith, userAuthenticated, users]) =>
        [userToChatWith, {...userAuthenticated, self: true}]
    )
  )

  sendMessage(inputValue: HTMLInputElement){
    this.messageInformation$
      .pipe(first())
      .subscribe(([currentChat, userAuthenticated]) => {
      const message: MessageInterface = {
        chat_id: currentChat!.id!,
        cnt: inputValue.value,
        type: 'TEXT',
        from: userAuthenticated as UserInterface,
        id: Math.random() * 1000000,
        sendStatus: SendStatus.sending
      }

      this.store.dispatch(WebchatActionsMessage.sendMessage(message))
      inputValue.value = ''

        setTimeout(() => {
          //this.scrollToBottom(this.cnt)
        }, 10)

    })

  }

}
