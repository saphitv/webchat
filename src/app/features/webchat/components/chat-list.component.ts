import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, filter, map, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {WebchatMessageSelectors, WebchatSelectors} from "../store/selectors/selectors-type";
import {Store} from "@ngrx/store";
import {WebchatActionsUser} from "../store/actions/actions-type";
import {WebchatState} from "../store/reducers/index.reducer";
import {ChatInterface} from "../interfaces/chat.interface";
import {MessageInterface} from "../interfaces/message.interface";

@Component({
  selector: 'app-chat-list',
  template: `
    <ul class="w-full h-screen py-5" *ngIf="lastMessage$ | async as lastMessage">
      <li class="list-none rounded-[10px] w-full h-20 p-4 flex items-center my-2 cursor-pointer flex"
          *ngFor="let chat of (chats$ | async)"
          (click)="navigateChat(chat)"
          [class.bg-dark-secondary]="currentChat && currentChat.id == chat.id"
      >

        <img src="https://source.unsplash.com/random" class="w-14 h-14 rounded-lg mr-4">
        <div class="w-28 overflow-hidden">
          <div class="text-white font-bold text-l">{{chat.name}}</div>
          <div class="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
            <ng-container *ngIf="lastMessage[chat.id]">{{lastMessage[chat.id].cnt}}</ng-container>
          </div>
        </div>

      </li>
    </ul>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent implements OnInit, OnDestroy {
  router = inject(Router)
  store = inject(Store<WebchatState>)

  subs: Subscription[] = []
  chats$: Observable<ChatInterface[]> =
    combineLatest([this.store.select(WebchatSelectors.selectChats), this.store.select(WebchatSelectors.selectTextChatFilter)])
      .pipe(
        map(([chats, filter]) => {
          return chats.filter(chat => chat.name?.toLowerCase().includes(filter.toLowerCase()))
        })
      )

  currentChat$: Observable<ChatInterface> = this.store.select(WebchatSelectors.selectCurrentChat).pipe(filter(chat => !!chat)) as Observable<ChatInterface>
  currentChat?: ChatInterface
  lastMessage$: Observable<{ [key: string]: MessageInterface }> = this.store.select(WebchatMessageSelectors.selectLastMessage)

  ngOnInit() {
    this.subs.push(this.currentChat$.subscribe(chat => {
      this.currentChat = chat
    }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  navigateChat(chat: ChatInterface){
    this.store.dispatch(WebchatActionsUser.setCurrentChat(chat))
  }
}
