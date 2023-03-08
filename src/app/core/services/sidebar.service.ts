import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() {
    const savedSidebarStatus = localStorage.getItem('sidebarStatus');
    if (savedSidebarStatus) {
      this.sidebarStatus$.next(savedSidebarStatus);
    }
  }

  isOpen = false;
  sidebarStatus$ = new BehaviorSubject<string>('close');
  changeStatus() {
    this.sidebarStatus$.value === 'open'
      ? this.sidebarStatus$.next('close')
      : this.sidebarStatus$.next('open');
    localStorage.setItem('sidebarStatus', this.sidebarStatus$.value);
    this.isOpen = !this.isOpen;
  }
}
