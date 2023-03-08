import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {combineLatest, map, Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {ThemeService} from "../../services/theme.service";
import {SidebarService} from "../../services/sidebar.service";
import { navBarItem } from "../../interfaces/navbar-item.interface"

@Component({
  selector: 'app-sidebar',
  template: `
      <div></div>
      <ng-container *ngIf="sidebar.sidebarStatus$ | async as sidebarStatus">
          <nav class="fixed top-0 left-0 h-screen w-[78px] px-4 py-3 bg-slate-100 dark:bg-zinc-800 rounded-r-md shadow transition-all"
               [ngClass]="{'!w-[240px]': sidebarStatus == 'open'}"
          >
              <!-- menu icon -->
              <div class="h-12 w-full">
                  <div (click)="sidebar.changeStatus()"
                       class="text-black dark:text-white text-base w-12 h-12 cursor-pointer flex items-center justify-center absolute right-0 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                           stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                      </svg>
                  </div>
              </div>

              <!-- menu items -->
              <ul style="height: calc(100% - 10rem)" class="w-full z-50">
                  <ng-container *ngIf="(theme.presentTheme$ | async) as themeName">
                      <li class="item relative list-none h-12 w-full my-4 transition-all top-0 "
                          *ngFor="let item of displaySidebarItems | async"
                          [ngClass]="{'hover:top-[-7px]': sidebarStatus == 'close'}">
                          <a [routerLink]="item.url"
                             class="link no-underline w-full flex items-center cursor-pointer !border-[3px] rounded-[10px]  h-full whitespace-nowrap border overflow-hidden border-c-purple dark:border-c-red bg-c-purple dark:bg-c-red "
                             [routerLinkActive]="['!bg-slate-50', 'dark:!bg-zinc-800']"
                             (click)="item.onClick()"
                          >
                              <div
                                      class="w-10 h-full text-white flex items-center justify-center transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                       stroke-width="2.5"
                                       stroke="currentColor" class="w-12 h-5">
                                      <path [routerLinkActive]="['text-c-purple', 'dark:text-white']"
                                            stroke-linecap="round"
                                            stroke-linejoin="round" [attr.d]="item.path"/>
                                  </svg>
                              </div>


                              <span class="relative left-[2%] text-white"
                                    [routerLinkActive]="['text-c-purple', 'dark:text-white']">{{item.name}}</span>
                          </a>
                          <span
                                  *ngIf="sidebarStatus == 'close'"
                                  class="tooltip top-0 left-[135px] -translate-x-1/2 shadow dark:bg-zinc-800 -translate-y-1/2 absolute top-0 rounded-md h-8 w-32 leading-9 text-center opacity-0 pointer-events-none block transition-all text-bold">{{item.name}}</span>
                      </li>
                  </ng-container>
              </ul>

              <! -- menu footer -->
              <div (click)="toogleTheme()"
                   class="cursor-pointer w-12 h-12 flex items-center justify-center m-0 transition-all"
                   [ngClass]="{'-ml-3': sidebarStatus == 'open'}"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="themeIcon[0]"/>
                  </svg>

              </div>

              <div class="w-12 bg-c-purple dark:bg-c-red rounded m-0 transition-all flex items-center justify-between opacity-70 cursor-not-allowed"
                   [ngClass]="{'!w-[240px] !-mx-4 h-[62px]': sidebarStatus == 'open'}">
                  <div *ngIf="sidebarStatus == 'open'" class="flex items-center ml-2">

                    <div class="avatar online">
                      <div class="h-10 w-10 rounded">
                        <img src="https://source.unsplash.com/random" alt="user profile" class="">
                      </div>
                    </div>

                      <div class="ml-2">
                          <div class="text-sm font-medium text-white">User Name</div>
                          <!--<div class="status">
                              <div  class="circle"></div>
                              <span class="nameStatus">online</span>
                          </div>-->
                      </div>
                  </div>
                  <div class="flex items-center justify-center w-12 h-12  text-white cursor-not-allowed cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                           stroke="currentColor" class="w-5 h-5 rotate-0 hover:rotate-90 transition-all">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>

                  </div>
              </div>
          </nav>
      </ng-container>
  `,
  styles: [`
    .item:hover .tooltip {
      opacity: 1;
      top: 50%;
    }
  `]
})
export class SidebarComponent implements OnInit {
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$
  isLoggedOut$: Observable<boolean> = this.authService.isLoggedOut$

  userEmail$: Observable<string> = this.authService.user$.pipe(map(user => user.email))
  userName$: Observable<string> = this.authService.user$.pipe(map(user => user.username))


  navbarItems$: Observable<navBarItem[]> = of([
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
    /*{
      name: 'Lessons', onClick: () => {},
      url: 'lessons', show: "LOGGED", auth: ["USER"],
      path: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z'
    },*/
    /*{
      name: 'Admin', onClick: () => {},
      url: 'admin', auth: ['ADMIN'], show: "LOGGED",
      path: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
    },*/
    {
      name: 'Webchat', onClick: () => {},
      url: 'webchat', show: "LOGGED", auth: ["USER"],
      path: 'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
    },
    {
      name: 'Logout', onClick: () => {
        this.authService.logout().subscribe(() => {
          this.router.navigateByUrl('auth/login')
        })
      }, show: "LOGGED",
      auth: ["USER"],
      path: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
    }
  ])

  themeIcon: string[] = [
    "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
    "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
  ]
  displaySidebarItems: Observable<navBarItem[]> = combineLatest([this.navbarItems$, this.isLoggedIn$, this.isLoggedOut$])
    .pipe(
      map(([items, isLoggedIn, isLoggedOut]) => {
        return items.filter(i => i.show == "LOGGED" && isLoggedIn || i.show == "UNLOGGED" && isLoggedOut)
      })
    )

  constructor(
    private authService: AuthService,
    private router: Router,
    public theme: ThemeService,
    public sidebar: SidebarService) {}

  ngOnInit(): void {
  }

  toogleTheme() {
    this.themeIcon = [this.themeIcon[1], this.themeIcon[0]]
    this.theme.changeTheme()
  }
}


