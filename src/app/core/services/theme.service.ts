import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService  {

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.presentTheme$.next(savedTheme);
    }
  }

  isDarkEnable = true;
  presentTheme$ = new BehaviorSubject<string>('light');
  changeTheme() {
    this.presentTheme$.value === 'light'
      ? this.presentTheme$.next('dark')
      : this.presentTheme$.next('light');
    localStorage.setItem('theme', this.presentTheme$.value);
    this.isDarkEnable = !this.isDarkEnable;
  }
}
