import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CoreState} from "../store/reducers/index.reducers";
import {Store} from "@ngrx/store";
import {CoreActions} from "../store/actions/actions-type";
import {CoreSelectors} from "../store/selectors/selectors-type";

@Injectable({
  providedIn: 'root'
})
export class ThemeService  {

  constructor(private store: Store<CoreState>) {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.store.dispatch(CoreActions.setTheme({theme: savedTheme}))
    }
  }

  changeTheme() {
    this.store.dispatch(CoreActions.toogleTheme());

    this.store.select(CoreSelectors.selectTheme).subscribe(theme => {
      localStorage.setItem('theme', theme);
    }).unsubscribe()

  }
}
