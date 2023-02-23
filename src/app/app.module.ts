import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {RbacAllowDirective} from './directives/rbac-allow.directive';
import {Router} from "@angular/router";
import {AuthorizationGuard} from "./services/authorization.guard";

@NgModule({
  declarations: [
    AppComponent,
    RbacAllowDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

  ],
  providers: [AuthService, {
    provide: 'adminsOnlyGuard',
    useFactory: (authService: AuthService, router: Router) =>
      new AuthorizationGuard(['ADMIN'], authService, router),
    deps: [AuthService, Router]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
