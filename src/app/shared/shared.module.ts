import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from "../core/modules/auth/services/auth.service";
import {Router} from "@angular/router";
import {AuthorizationGuard} from "../core/guard/authorization.guard";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: 'adminsOnlyGuard',
      useFactory: (authService: AuthService, router: Router) => new AuthorizationGuard(['ADMIN'], authService, router),
      deps: [AuthService, Router],
    },
  ]
})
export class SharedModule { }
