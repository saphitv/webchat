import { Component, OnInit } from '@angular/core';
import {WebchatService} from "./services/webchat.service";
import {combineLatest, concatMap, filter, tap} from "rxjs";
import {WebchatSelectors} from "./store/selectors/selectors-type";
import {WebchatActions} from "./store/actions/actions-type";
import {WebchatState} from "./store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {UserInterface} from "./interfaces/user.interface";

@Component({
  selector: 'app-webchat',
  template: `
    <div class="flex overflow-hidden">
    <div class="w-[240px] bg-green-100">
      <app-chat-list></app-chat-list>
    </div>
   <div style="width: calc(100% - 240px)">
     <app-chat-body></app-chat-body>
   </div>
    </div>
  `,
  styles: [
  ]
})
export class WebchatComponent implements OnInit {

  constructor(private webchat: WebchatService, private activatedRoute: ActivatedRoute, private store: Store<WebchatState>){
    combineLatest([this.activatedRoute.params, this.store.select(WebchatSelectors.selectCurrentChat)])
      .pipe(
        filter(([params, currentChat]) => {
          return !currentChat || params["user"] != currentChat.username
        }),
        tap(([params, currentChat]) => console.log(params, currentChat)),
        concatMap(([params, currentChat]) => {
          return this.store.select(WebchatSelectors.selectUserByName({name: params["user"]}))
        }),
        tap(user => {
          console.log(user)
          this.store.dispatch(WebchatActions.setCurrentChat(user as any))
        })
      )
      .subscribe().unsubscribe()
  }

  ngOnInit(): void {
    this.webchat.connect()
  }

}
