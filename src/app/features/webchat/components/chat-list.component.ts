import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {WebchatService} from "../services/webchat.service";
import {filter, map, Observable, Subject, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {UserInterface} from "../interfaces/user.interface";
import {WebchatSelectors} from "../store/selectors/selectors-type";
import {Store} from "@ngrx/store";
import { WebchatActionsUser } from "../store/actions/actions-type";
import {WebchatState} from "../store/reducers/index.reducer";

@Component({
  selector: 'app-chat-list',
  template: `
    <ul class="w-full h-screen py-5">
        <li class="list-none rounded-[10px] w-full h-20 p-4 flex items-center my-2 cursor-pointer flex"
            *ngFor="let user of (users$ | async)"
            (click)="navigateChat(user)"
            [class.bg-dark-secondary]="currentChat && currentChat.username == user.username"
        >

          <img src="https://source.unsplash.com/random" class="w-14 h-14 rounded-lg mr-4">
          <div class="w-28 overflow-hidden">
            <div class="text-white font-bold text-l">{{user.username}}</div>
            <div class="overflow-hidden text-sm whitespace-nowrap text-ellipsis">Ciao come stai io sto bene</div>
          </div>

        </li>
    </ul>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent implements OnInit, OnDestroy {
  router = inject(Router)
  store = inject(Store<WebchatState>)

  subs: Subscription[] = []
  users$: Observable<UserInterface[]> = this.store.select(WebchatSelectors.selectUsers)
    .pipe(
      map(users => users.filter(user => !user.self))
    )
  currentChat$: Observable<UserInterface> = this.store.select(WebchatSelectors.selectCurrentChat).pipe(filter(user => !!user)) as Observable<UserInterface>
  currentChat?: UserInterface

  ngOnInit() {
    this.subs.push(this.currentChat$.subscribe(user => {
      this.currentChat = user
    }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  navigateChat(user: UserInterface){
    this.store.dispatch(WebchatActionsUser.setCurrentChat(user))
  }
}
