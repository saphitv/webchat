import {ChangeDetectionStrategy, Component, inject, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {concatMap, filter, ReplaySubject, Subscription, tap} from 'rxjs';
import {Store} from "@ngrx/store";
import {WebchatState} from "../../store/reducers/index.reducer";
import {WebchatSelectors} from "../../store/selectors/selectors-type";
import {AuthSelectors} from "../../../auth/store/selectors/selectors-type";
import {selectMessagesFromCurrentChat} from "../../store/selectors/webchat.selector";

@Component({
  selector: 'app-chat-body',
  template: `
    <ng-container *ngIf="userAuthenticated$ | async as userAuthenticated">
      <app-navbar></app-navbar>
      <div class="w-full h-full" style="height: calc(100vh - 4rem - 4rem)">
        <ng-container *ngFor="let mes of messages$ | async">
          <div class="chat" [ngClass]="{'chat-start': userAuthenticated.id != mes.from.id, 'chat-end':  userAuthenticated.id == mes.from.id}">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                <!--<img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />-->
              </div>
            </div>
            <div class="chat-header">
                {{mes.from.username}}
              <time class="text-xs opacity-50">12:45</time>
            </div>
            <div class="chat-bubble">{{mes.cnt}}</div>
            <div class="chat-footer opacity-50">
              Delivered
            </div>
          </div>
        </ng-container>
        </div>



      <app-inputbar></app-inputbar>
    </ng-container>

  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBodyComponent {

  store = inject(Store<WebchatState>)

  userAuthenticated$ = this.store.select(AuthSelectors.selectUserState)

  messages$ = this.store.select(WebchatSelectors.selectMessagesFromCurrentChat)
}
