import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {RouterLinkActive, RouterLinkWithHref} from "@angular/router";
import {RbacAllowDirective} from "../directives/rbac-allow.directive";



@NgModule({
  declarations: [
    SidebarComponent,
    RbacAllowDirective
  ],
  exports: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterLinkWithHref,
    RouterLinkActive
  ]
})
export class CoreModule { }
