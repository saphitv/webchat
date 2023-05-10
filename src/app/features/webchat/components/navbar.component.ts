import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {WebchatSelectors} from "../store/selectors/selectors-type";
import {WebchatState} from "../store/reducers/index.reducer";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-navbar',
  template: `
    <div class="h-16 w-auto bg-white dark:bg-dark-secondary m-5 rounded-[14px] mr-8 flex items-center justify-between">
      <ng-container
        *ngIf="currentChat$ | async as currentChat">

        <div class="font-bold text-lg ml-4">
            {{currentChat.name}}
        </div>
        <div class="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-not-allowed">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
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

  currentChat$ = this.store.select(WebchatSelectors.selectCurrentChat)

}
