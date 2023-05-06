import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  find,
  from,
  fromEvent,
  map,
  Subscription
} from "rxjs";
import {Store} from "@ngrx/store";
import {WebchatState} from "../store/reducers/index.reducer";
import {WebchatActionsChat} from "../store/actions/actions-type";
import {WebchatSelectors} from "../store/selectors/selectors-type";
import {UserInterface} from "../interfaces/user.interface";

@Component({
  selector: 'app-search-users',
  template: `
    <div class="flex p-3 bg-dark-secondary rounded-[14px]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
           class="w-8 h-8 p-[4px]">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
      </svg>
      <input #searchInput type="text" placeholder="Search" class="outline-none text-dark-text bg-transparent pl-2"
             style="width: calc(100% - 2rem)">
      <svg #addChat xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7"
           stroke="currentColor"
           class="w-8 h-8 bg-gray-600 cursor-pointer rounded p-[4px]">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
      </svg>
    </div>

    <!-- Put this part before </body> tag -->
    <div class="fixed h-screen flex items-center justify-center top-0 left-[78px] bg-color-[#11100]"
         *ngIf="showAddChatDialog" style="width: calc(100vw - 78px);z-index: 999; background: #2229;"
         id="closeAddDialog" #closeAddDialog>
      <div class="modal-box w-3/4 min-w-[400px] h-fit max-h-[80%]">
        <h3 class="text-2xl font-bold">Create chat</h3>
        <div class="mt-2 py-2 w-full">
          <input #addInput (keyup.enter)="addUserFromInput(addInput)" type="text" placeholder="Type here"
                 class="input input-bordered mr-4" style="width: calc(100% - 6rem)"/>
          <button (click)="addUserFromInput(addInput)" class="btn">Add</button>
        </div>
        <ul>
          <li *ngFor="let user of allFriend$ | async"
              class="flex h-20 w-full  rounded-lg flex items-center border-gray-300/20">
            <div class="w-16 flex items-center justify-center">
              <input type="checkbox" [checked]="user.checked" #checkBox (change)="addUserFromCheckbox(checkBox, user)"
                     class="checkbox"/>
            </div>

            <div class="avatar">
              <div class="w-14 rounded">
                <img src="https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200"/>
              </div>
            </div>
            <div class="ml-2 font-bold">{{user.username}}</div>
          </li>
        </ul>
        <div class="modal-action">
          <a #createChat class="btn">Create</a>
        </div>
      </div>
    </div>

  `,
  styles: []
})
export class SearchUsersComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: any
  @ViewChild('addChat') addChat: any
  @ViewChild('closeAddDialog') closeAddDialog: any
  @ViewChild('createChat') createChat: any
  store = inject(Store<WebchatState>)
  cdr = inject(ChangeDetectorRef)

  showAddChatDialog: boolean = false

  usersToAdd$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([])

  allFriend$ = combineLatest([this.store.select(WebchatSelectors.selectAllUsers), this.usersToAdd$]).pipe(
    map(([users, usersToAdd]) => users.map(user => ({...user, checked: usersToAdd.includes(user.id)}))),
  )


  addUserFromInput(input: HTMLInputElement) {
    this.allFriend$
      .pipe(
        concatMap(users => from(users)),
        find(user => user.username === input.value)
      )
      .subscribe(user => {
        if (user)
          this.usersToAdd$.next([...new Set([...this.usersToAdd$.value, user.id])])
        input.value = ''
      }).unsubscribe()
  }

  addUserFromCheckbox(input: HTMLInputElement, user: UserInterface) {
    if (input.checked) {
      this.usersToAdd$.next([...new Set([...this.usersToAdd$.value, user.id])])
    } else {
      this.usersToAdd$.next(this.usersToAdd$.value.filter(id => id != user.id))
    }
  }

  openAddChatDialog() {
    this.showAddChatDialog = true
    this.store.dispatch(WebchatActionsChat.loadAllUsers())
    this.cdr.detectChanges()

    setTimeout(() => {
      let subs: Subscription[] = []

      subs.push(fromEvent(this.closeAddDialog.nativeElement, 'click').subscribe((event: any) => {
        if (event.target.id === 'closeAddDialog') {
          this.showAddChatDialog = false
          subs.forEach(sub => sub.unsubscribe())
        }
      }))

      subs.push(fromEvent(this.createChat.nativeElement, 'click')
        .subscribe((event) => {
          this.store.dispatch(WebchatActionsChat.createChat({users: this.usersToAdd$.value}))
          this.showAddChatDialog = false
          subs.forEach(sub => sub.unsubscribe())
        }))

    }, 10)
  }

  ngAfterViewInit() {

    // this.openAddChatDialog()

    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(50),
      distinctUntilChanged(),
      map((event: any) => event.target.value),
    ).subscribe(value => {
      this.store.dispatch(WebchatActionsChat.searchChat({text: value}))
    })

    fromEvent(this.addChat.nativeElement, 'click').subscribe(() => {
      this.openAddChatDialog()
    })


  }
}
