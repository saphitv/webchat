import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {RbacAllowDirective} from './directives/rbac-allow.directive';
import {Router} from "@angular/router";
import {AuthorizationGuard} from "./services/authorization.guard";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";

const config: SocketIoConfig = {
  url: 'https://localhost:3001', // socket server url;
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RbacAllowDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
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
