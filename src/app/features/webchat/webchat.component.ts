import { Component, OnInit } from '@angular/core';
import {WebchatService} from "./services/webchat.service";
import {combineLatest} from "rxjs";
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
    combineLatest([this.activatedRoute.params, this.store.select(WebchatSelectors.selectCurrentChat)]).subscribe(([params, currentChat]) => {
      if(!currentChat || params["user"] != currentChat.username){
        this.store.select(WebchatSelectors.selectUserByName({name: params["user"]})).subscribe(user => {
          if(user)
            this.store.dispatch(WebchatActions.setCurrentChat(user))
        }).unsubscribe()
      }
    }).unsubscribe()

    this.activatedRoute.params.subscribe(params => {
      console.log(params)
    })
  }

  ngOnInit(): void {
    this.webchat.connect()
  }

}
