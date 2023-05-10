import {isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./core/modules/auth/services/auth.service";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {CoreModule} from "./core/core.module";
import {StoreModule} from '@ngrx/store';
import {SharedModule} from "./shared/shared.module";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from "@ngrx/effects";
import {AuthModule} from "./core/modules/auth/auth.module";
import {RouterState, StoreRouterConnectingModule} from '@ngrx/router-store';

const config: SocketIoConfig = {
  url: '/', // socket server url;
  options: {
    transports: ['websocket'],
    // path: '/socket',
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

    StoreRouterConnectingModule.forRoot({ stateKey: 'router', routerState: RouterState.Minimal}),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
