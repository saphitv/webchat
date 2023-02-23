import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  template: `
    <div class="hero min-h-[80vh]">
      <div class="hero-content text-center">
        <img
          src="https://m.media-amazon.com/images/M/MV5BNjFiZTllM2ItMDBmMy00YjczLTgxMDktYmZhMWY4MDAyMjRlXkEyXkFqcGdeQXZ3ZXNsZXk@._V1_.jpg"
          class="max-w-sm rounded-lg shadow-2xl"/>
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello there</h1>
          <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.</p>

          <ng-container >
            <button *ngIf="isLoggedOut$ | async" class="btn btn-primary m-2" routerLink="auth/login">Login</button>
            <button *ngIf="isLoggedOut$ | async" class="btn btn-primary m-2" routerLink="auth/register">register</button>

            <ng-container *ngIf="isLoggedIn$ | async">
              <button class="btn btn-primary m-2" (click)="logout()" >logout ({{userEmail$ | async}})</button>
              <button class="btn btn-primary m-2" routerLink="lessons">Lessons</button>
              <button *appRbacAllow="['ADMIN']" class="btn btn-primary m-2" routerLink="admin">Admin</button>
            </ng-container>

          </ng-container>

        </div>
      </div>

    </div>
    <router-outlet></router-outlet>

  `,
  styles: []
})
export class AppComponent implements OnInit {

  isLoggedIn$: Observable<boolean> | undefined
  isLoggedOut$: Observable<boolean> | undefined

  userEmail$: Observable<string> = this.authService.user$.pipe(map(user => user.email))

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$
    this.isLoggedOut$ = this.authService.isLoggedOut$
  }


  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/')
    })
  }
}
