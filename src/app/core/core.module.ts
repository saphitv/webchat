import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {RouterLinkActive, RouterLink} from "@angular/router";
import {RbacAllowDirective} from "../shared/directives/rbac-allow.directive";
import {StoreModule} from "@ngrx/store";
import {CoreReducer} from "./store/reducers/index.reducers";


@NgModule({
  declarations: [
    SidebarComponent,
    RbacAllowDirective,

  ],
  exports: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    StoreModule.forFeature('core', CoreReducer),
  ]
})
export class CoreModule { }
