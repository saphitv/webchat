import {NgModule, isDevMode} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./features/auth/services/auth.service";
import {RbacAllowDirective} from './shared/directives/rbac-allow.directive';
import {Router} from "@angular/router";
import {AuthorizationGuard} from "./core/guard/authorization.guard";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {CoreModule} from "./core/core.module";
import { StoreModule } from '@ngrx/store';
import {SharedModule} from "./shared/shared.module";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {EffectsModule} from "@ngrx/effects";
import {AuthModule} from "./features/auth/auth.module";

const config: SocketIoConfig = {
  url: 'https://localhost:3001', // socket server url;
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    CoreModule,
    AuthModule,
    SharedModule,

    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
        strictActionTypeUniqueness: true,
        strictActionWithinNgZone: true,
        strictActionSerializability: false,
        strictStateSerializability: false,
      },
    }),
    EffectsModule.forRoot([]),

    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
