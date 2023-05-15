import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {WebchatSelectors} from "../store/selectors/selectors-type";
import {WebchatState} from "../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {ChatInterface} from "../interfaces/chat.interface";
import {WebchatActionsChat} from "../store/actions/actions-type";
import {fromEvent} from "rxjs";

@Component({
  selector: 'app-navbar', template: `
    <div class="h-16 w-auto bg-white dark:bg-dark-secondary m-5 rounded-[14px] mr-8 flex items-center justify-between">
      <ng-container
        *ngIf="currentChat$ | async as currentChat">

        <div class="font-bold text-lg ml-4">
          {{currentChat.name}}
        </div>
        <div class="dropdown dropdown-end mr-4">
          <label tabindex="0" class="btn btn-ghost rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6 cursor-pointer">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
            </svg>
          </label>
          <ul tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <li (click)="openRenameDialog(currentChat)"><a>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
              </svg>
              <span>Rename</span></a></li>
            <li (click)="deleteChat(currentChat)"><a>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
              </svg>
              <span>Delete</span></a></li>
          </ul>
        </div>


        <ng-container>
          <div class="fixed h-screen flex items-center justify-center top-0 left-[78px] bg-color-[#11100]"
               *ngIf="showRenameDialog" style="width: calc(100vw - 78px);z-index: 999; background: #2229;"
               id="closeAddDialog" #closeRenameDialog>
            <div class="modal-box">
              <div class="mt-2 py-2 w-full">
                <input #renameInput (keyup.enter)="renameChat(currentChat, renameInput.value)" type="text"
                       placeholder="New Chat name"
                       class="input input-bordered mr-4" style="width: calc(100% - 6rem)"/>
                <button (click)="renameChat(currentChat, renameInput.value)" class="btn
                bg-c-purple text-white border-none hover:bg-c-purple hover:opacity-80
                dark:bg-c-red">Save
                </button>
              </div>

            </div>
          </div>
        </ng-container>
      </ng-container>
    </div>


  `, styles: [], changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  store = inject(Store<WebchatState>)
  cdr = inject(ChangeDetectorRef)

  currentChat$ = this.store.select(WebchatSelectors.selectCurrentChat)

  showRenameDialog = false

  @ViewChild('closeRenameDialog') closeRenameDialogRef!: ElementRef
  @ViewChild('renameInput') renameInput!: ElementRef

  openRenameDialog(chat: ChatInterface) {
    this.showRenameDialog = true

    setTimeout(() => {
      this.renameInput.nativeElement.value = chat.name
      this.renameInput.nativeElement.focus()
      fromEvent(this.closeRenameDialogRef.nativeElement, 'click').subscribe((event: any) => {
        if (event.target.id === 'closeAddDialog')
          this.closeRenameDialog()
      })
    }, 100)
  }

  closeRenameDialog() {
    this.showRenameDialog = false
    this.cdr.detectChanges()
  }

  renameChat(chat: ChatInterface, newName: string) {
    this.store.dispatch(WebchatActionsChat.renameChat({chat, name: newName.trim()}))
    this.closeRenameDialog()
  }

  deleteChat(chat: ChatInterface) {
    this.store.dispatch(WebchatActionsChat.deleteChat({chat}))
  }

}
