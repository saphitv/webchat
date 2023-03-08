import {ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, ReplaySubject, Subject, Subscription} from 'rxjs';
import {WebchatService} from "../../services/webchat.service";

@Component({
  selector: 'app-chat-body',
  template: `
    <ng-container *ngIf="userToChatWith?.asObservable() | async as userToChatWith">
      <app-navbar>
        {{ userToChatWith }}
      </app-navbar>
      <div class="w-full h-full" style="height: calc(100vh - 4rem - 4rem)">
        <ng-container *ngFor="let mes of messages | async">
          <div class="chat" [ngClass]="{'chat-start': mes.from != 'test', 'chat-end': mes.from == 'test'}">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                <!--<img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />-->
              </div>
            </div>
            <div class="chat-header">
                {{mes.from}}
              <time class="text-xs opacity-50">12:45</time>
            </div>
            <div class="chat-bubble">{{mes.cnt}}</div>
            <div class="chat-footer opacity-50">
              Delivered
            </div>
          </div>
        </ng-container>
        </div>



      <app-inputbar [chatWithUser]="userToChatWith"></app-inputbar>
    </ng-container>

  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBodyComponent implements OnInit {

  userToChatWith?: BehaviorSubject<string>
  messages: ReplaySubject<any> = new ReplaySubject<any>(1)


  constructor(private activatedRoute: ActivatedRoute, private webchat: WebchatService) {
    this.activatedRoute.params.subscribe(params => {
      if(this.userToChatWith)
        this.userToChatWith.next(params["user"])
      else
        this.userToChatWith = new BehaviorSubject(params["user"])
    })

    let subs: Subscription[] = []

    this.userToChatWith?.subscribe(user => {
      if(subs.length > 0)
        subs.forEach(sub => sub.unsubscribe())

      subs.push(this.webchat.getMessageFromChat(user).subscribe(mes => {
        this.messages.next(mes)
      }))

    })
  }

  ngOnInit(): void {
    this.userToChatWith?.subscribe(username => {
      this.webchat.userToChatWith.next(username)
    })
  }



}
