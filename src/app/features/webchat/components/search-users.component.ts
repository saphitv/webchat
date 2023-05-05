import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, fromEvent, map} from "rxjs";
import {Store} from "@ngrx/store";
import {WebchatState} from "../store/reducers/index.reducer";
import {WebchatActionsChat} from "../store/actions/actions-type";

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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor"
           class="w-8 h-8 bg-gray-600 cursor-pointer rounded p-[4px]">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
      </svg>
    </div>
  `,
  styles: []
})
export class SearchUsersComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: any
  store = inject(Store<WebchatState>)

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(50),
      distinctUntilChanged(),
      map((event: any) => event.target.value),
    ).subscribe(value => {
      this.store.dispatch(WebchatActionsChat.searchChat({text: value}))
    })
  }
}
