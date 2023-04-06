import {Component, inject, OnInit} from '@angular/core';
import {WebchatService} from "./services/webchat.service";
import {combineLatest, concatMap, filter, tap} from "rxjs";
import {WebchatSelectors} from "./store/selectors/selectors-type";
import {WebchatActions} from "./store/actions/actions-type";
import {WebchatState} from "./store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
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

  router = inject(Router)

  constructor(private webchat: WebchatService, private activatedRoute: ActivatedRoute, private store: Store<WebchatState>){
    const ref = combineLatest([
      this.activatedRoute.params,
      this.store.select(WebchatSelectors.selectCurrentChat),
      this.store.select(WebchatSelectors.areUsersLoaded)
    ])
      .pipe(
        /* tap(([params, currentChat, areUsersLoaded]) => console.log(params, currentChat, areUsersLoaded)), */
        filter(([params, currentChat, areUsersLoaded]) => {
          return areUsersLoaded && (!currentChat || params["user"] != currentChat.username)
        }),
        concatMap(([params, _, areUsersLoaded]) => {
          return this.store.select(WebchatSelectors.selectUserByName({name: params["user"]}))
        }),
        tap(user => {
          if(user) {
            this.store.dispatch(WebchatActions.setCurrentChat(user))
            ref.unsubscribe()

          }
          else
            this.router.navigateByUrl("/webchat")


        })
      )
      .subscribe()
  }

  ngOnInit(): void {
    this.webchat.connect()
  }

}
