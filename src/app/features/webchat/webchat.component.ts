import {Component, inject, OnInit} from '@angular/core';
import {WebchatService} from "./services/webchat.service";
import {combineLatest, concatMap, filter, tap} from "rxjs";
import {WebchatSelectors} from "./store/selectors/selectors-type";
import { WebchatActionsUser } from "./store/actions/actions-type";
import {WebchatState} from "./store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthSelectors} from "../auth/store/selectors/selectors-type";

@Component({
  selector: 'app-webchat',
  template: `
      <div class="flex">
          <div class="flex overflow-hidden bg-dark-primary rounded-l-[25px] h-screen w-full">
              <div class="w-[320px] pl-6 pt-6 pr-4 pb-4">
                  <app-search-users></app-search-users>
                  <app-chat-list></app-chat-list>
              </div>
              <div style="width: calc(100% - 320px)">
                <ng-container *ngIf="userSelected$ | async as userSelected">
                  <app-chat-body></app-chat-body >
                </ng-container>

              </div>
          </div>
          <!--<div class="w-[420px] bg-dark-thirdary">
              <app-chat-details></app-chat-details>
          </div>-->
      </div>
  `,
  styles: [
  ]
})
export class WebchatComponent implements OnInit {

  router = inject(Router)
  userSelected$ = this.store.select(WebchatSelectors.isUserSelected)

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
            this.store.dispatch(WebchatActionsUser.setCurrentChat(user))
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
