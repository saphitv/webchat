import {Component, inject, OnInit} from '@angular/core';
import {WebchatService} from "./services/webchat.service";
import {filter} from "rxjs";
import {WebchatSelectors} from "./store/selectors/selectors-type";
import {WebchatActionsMessage} from "./store/actions/actions-type";
import {WebchatState} from "./store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-webchat',
  template: `
    <div class="flex">
      <div class="flex overflow-hidden bg-dark-primary rounded-l-[25px] h-screen w-full overflow-hidden">
        <div class="w-[320px] pl-6 pt-6 pr-4 pb-4">
          <app-search-users></app-search-users>
          <app-chat-list></app-chat-list>
        </div>
        <div style="width: calc(100% - 320px)">
          <ng-container *ngIf="userSelected$ | async as userSelected">
            <app-chat-body></app-chat-body>
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
    // load the current chat
    // TODO: da decidere come far funzionare il routing con chat singole e chat di gruppo #8
    // momentaneamente disabilitato perchè è da decidere come far funzionare il routing con chat singole e chat di gruppo
    /*const ref = combineLatest([
      this.activatedRoute.params,
      this.store.select(WebchatSelectors.selectCurrentChat),
      this.store.select(WebchatSelectors.areChatsLoaded)
    ])
      .pipe(
        filter(([params, currentChat, areChatsLoaded]) => {
          return areChatsLoaded && (!currentChat  || params["chat"] != currentChat.id ) // il filtro veniva applicato se il parametro chat era uguale alla chat selezionata
        }),
        concatMap(([params, _, areUsersLoaded]) => {
          return this.store.select(WebchatSelectors.selectUserByName({name: params["user"]}))
        }),
        tap(chat => {
          if(chat) {
            this.store.dispatch(WebchatActionsUser.setCurrentChat(chat))
            ref.unsubscribe()
          }
          else
            this.router.navigateByUrl("/webchat")

        })
      )
      .subscribe()*/
  }

  ngOnInit(): void {
    this.webchat.connect()
    this.store.select(WebchatSelectors.selectCurrentChat)
      .pipe(
        filter(chat => chat != null),
        /*concatMap(chat => {
          return combineLatest([this.store.select(WebchatSelectors.selectMessagesByChatId({chatId: chat!.id})), of(chat)]).pipe(first())
        }),*/
        filter((chat) => chat!.messageLoaded == false),
        // map(([messages, chat]) => chat),
      ).subscribe(chat => {
      this.store.dispatch(WebchatActionsMessage.loadChatMessages({chatId: chat!.id}))
    })
  }

}
