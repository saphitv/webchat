import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {WebchatService} from "../../services/webchat.service";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";
import {UserInterface} from "../../interfaces/user.interface";
import {WebchatSelectors} from "../../store/selectors/selectors-type";
import {Store} from "@ngrx/store";
import {WebchatActions} from "../../store/actions/actions-type";
import {WebchatState} from "../../store/reducers/index.reducer";

@Component({
  selector: 'app-chat-list',
  template: `
    <div class="w-full h-screen">
        <li class="list-none bg-red-100 w-full h-12 p-4 flex item-center my-2 cursor-pointer"
            *ngFor="let user of (users$ | async)"
            (click)="navigateChat(user)"
        >{{user.username}} {{user.self ? '(yourself)' : ''}}</li>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent {
  router = inject(Router)
  store = inject(Store<WebchatState>)
  users$: Observable<UserInterface[]> = this.store.select(WebchatSelectors.selectUsers)

  navigateChat(user: UserInterface){
    this.store.dispatch(WebchatActions.setCurrentChat(user))
  }
}
