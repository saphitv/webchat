import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {WebchatSelectors} from "../../store/selectors/selectors-type";
import {WebchatState} from "../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-navbar',
  template: `
    <div class="h-12 w-full bg-primary">
      <ng-container
        *ngIf="userToChatWith$ | async as userToChatWith">

        <div>
            {{userToChatWith.username}}
        </div>
      </ng-container>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  store = inject(Store<WebchatState>)

  userToChatWith$ = this.store.select(WebchatSelectors.selectCurrentChat)

}
