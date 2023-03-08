import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";
import {ThemeService} from "./core/services/theme.service";
import {SidebarService} from "./core/services/sidebar.service";

@Component({
  selector: 'app-root',
  template: `

    <div style="z-index: 99" class="relative">
      <app-sidebar></app-sidebar>
    </div>

      <div style="z-index: 0" class="relative transition-all" style="width: calc(100vw - {{leftWidth}}px); left: {{leftWidth}}px">
          <router-outlet></router-outlet>
      </div>

  `,
  styles: []
})
export class AppComponent implements OnInit {
  leftWidth?: number

  isLoggedIn$: Observable<boolean> | undefined
  isLoggedOut$: Observable<boolean> | undefined

  userEmail$: Observable<string> = this.authService.user$.pipe(map(user => user.email))

  constructor(private authService: AuthService, private router: Router, public theme: ThemeService, private sidebar: SidebarService) {
    this.sidebar.sidebarStatus$.subscribe(val => {
      this.leftWidth = val == "open" ? 240 : 78
    })

    this.isLoggedIn$ = this.authService.isLoggedIn$
    this.isLoggedOut$ = this.authService.isLoggedOut$

    this.theme.presentTheme$.subscribe(theme => {
      let body = (document.querySelector("body") as any)
      let html = (document.querySelector("html") as any)

      body.classList = []
      body.classList.add(theme)
      html.setAttribute("data-theme", theme)
    })
  }

  ngOnInit(): void {



  }



}
