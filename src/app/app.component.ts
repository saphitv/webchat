import {Component} from '@angular/core';
import {AuthService} from "./core/modules/auth/services/auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ThemeService} from "./core/services/theme.service";
import {SidebarService} from "./core/services/sidebar.service";
import {LoginActions} from "./core/modules/auth/store/actions/actions-type";
import {Store} from "@ngrx/store";
import {AppState} from "./store/reducers/index.reducer";
import {CoreSelectors} from "./core/store/selectors/selectors-type";

@Component({
  selector: 'app-root',
  template: `

    <div style="z-index: 99" class="relative">
      <app-sidebar></app-sidebar>
    </div>

      <div class="relative transition-all dark:bg-zinc-800 bg-slate-100"
           style="z-index: 0; width: calc(100vw - {{ leftWidth }}px); left: {{ leftWidth }}px">
          <router-outlet></router-outlet>
      </div>

  `,
  styles: []
})
export class AppComponent {
  leftWidth: number = 78


  subs: Subscription[] = []
  theme$: Observable<"light" | "dark"> = this.store.select(CoreSelectors.selectTheme)
  isSidebarOpen$: Observable<boolean> = this.store.select(CoreSelectors.isSidebarOpen)

  constructor(
    private authService: AuthService,
    private router: Router,
    public theme: ThemeService,
    private sidebar: SidebarService,
    private  store: Store<AppState>) {


    this.store.dispatch(LoginActions.loadUser())


    this.subs.push(this.isSidebarOpen$.subscribe(isOpen => {
      this.leftWidth = isOpen ? 240 : 78
    }))

    this.subs.push(this.theme$.subscribe((theme: "light" | "dark") => {
      let body = (document.querySelector("body") as any)
      let html = (document.querySelector("html") as any)

      body.classList = []
      body.classList.add(theme)
      html.setAttribute("data-theme", theme)
    }))

  }

}
