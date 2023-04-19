import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject, OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {concatMap, delay, filter, ReplaySubject, Subscription, tap} from 'rxjs';
import {Store} from "@ngrx/store";
import {WebchatState} from "../store/reducers/index.reducer";
import {WebchatSelectors} from "../store/selectors/selectors-type";
import {AuthSelectors} from "../../auth/store/selectors/selectors-type";
import {selectMessagesFromCurrentChat} from "../store/selectors/webchat.selector";

@Component({
  selector: 'app-chat-body',
  template: `
    <ng-container *ngIf="userAuthenticated$ | async as userAuthenticated">
      <app-navbar></app-navbar>
      <div id="cnt" class="w-full h-full overflow-y-scroll" style="height: calc(100vh - 7rem - 4rem)" #cnt>
        <ng-container *ngFor="let mes of messages$ | async">
          <div class="chat" [ngClass]="{'chat-start': userAuthenticated.id != mes.from.id, 'chat-end':  userAuthenticated.id == mes.from.id}">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                <!--<img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />-->
              </div>
            </div>
            <div class="chat-header">
                {{mes.from.username}}
              <!--<time class="text-xs opacity-50">12:45</time>-->
            </div>
            <div class="chat-bubble">{{mes.cnt}}</div>
            <!--<div class="chat-footer opacity-50">
              Delivered
            </div>-->
          </div>
        </ng-container>
        </div>



      <app-inputbar [scrollToBottom]="scrollDown" [cnt]="this.cnt"></app-inputbar>
    </ng-container>

  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBodyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cnt') cnt!: HTMLDivElement;
  subs: Subscription[] = []

  store = inject(Store<WebchatState>)

  userAuthenticated$ = this.store.select(AuthSelectors.selectUserState)

  messages$ = this.store.select(WebchatSelectors.selectMessagesFromCurrentChat)

  ngAfterViewInit() {
    this.scrollDown()

    this.subs.push(this.messages$
      .pipe(
        delay(10),
        tap(_ => this.scrollDown()),
      ).subscribe(_ => {

      }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  scrollDown() {
    const cnt = document.getElementById('cnt')

    if(cnt)
      cnt.scrollTop = cnt.scrollHeight;
  }
}
