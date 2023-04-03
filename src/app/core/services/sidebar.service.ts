import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CoreState} from "../store/reducers/index.reducers";
import {Store} from "@ngrx/store";
import {CoreActions} from "../store/actions/actions-type";
import {CoreSelectors} from "../store/selectors/selectors-type";
import {LoginActions} from "../../features/auth/store/actions/actions-type";
import {Router} from "@angular/router";
import {sidebarItem} from "../interfaces/sidebar-item.interface";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  initialSidebarItem: sidebarItem[] = [
    {
      name: 'Login', onClick: () => {},
      url: 'auth/login', show: "UNLOGGED", auth: [],
      path: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
    },
    {
      name: 'Register', onClick: () => {},
      url: 'auth/register', show: "UNLOGGED", auth: [],
      path: 'M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z'
    },
    {
      name: 'Webchat', onClick: () => {},
      url: 'webchat', show: "LOGGED", auth: ["USER"],
      path: 'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
    },
    {
      name: 'Logout', onClick: () => {
        this.store.dispatch(LoginActions.userLoggedOut())
        this.router.navigateByUrl('')
      },
      show: "LOGGED",
      auth: ["USER"],
      path: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
    }
  ]

  constructor(private store: Store<CoreState>, private router: Router) {
    const savedSidebarStatus = localStorage.getItem('sidebarStatus') as "open" | "close";
    if (savedSidebarStatus) {
      this.store.dispatch(CoreActions.setSidebarStatus({sidebarStatus: savedSidebarStatus}))
    }
    this.store.dispatch(CoreActions.setSidebarItems({sidebarItems: this.initialSidebarItem}))
  }

  changeStatus() {
    this.store.dispatch(CoreActions.toggleSidebar())
    const isSidebarOpen = this.store.select(CoreSelectors.isSidebarOpen)

    const ref = isSidebarOpen.subscribe(isOpen => {
      localStorage.setItem('sidebarStatus', isOpen ? 'open' : 'close');
      ref.unsubscribe()
    })
  }
}
