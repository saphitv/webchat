import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {RbacAllowDirective} from "../shared/directives/rbac-allow.directive";
import {StoreModule} from "@ngrx/store";
import {CoreReducer} from "./store/reducers/index.reducers";
import {AuthModule} from "./modules/auth/auth.module";


@NgModule({
  declarations: [
    SidebarComponent,
    RbacAllowDirective,

  ],
  exports: [
    SidebarComponent,
    AuthModule
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    StoreModule.forFeature('core', CoreReducer),
    AuthModule
  ]
})
export class CoreModule { }
