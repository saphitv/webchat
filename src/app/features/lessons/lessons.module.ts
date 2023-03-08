import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LessonsRoutingModule} from './lessons-routing.module';
import {LessonsComponent} from './components/lessons/lessons.component';


@NgModule({
  declarations: [
    LessonsComponent
  ],
  imports: [
    CommonModule,
    LessonsRoutingModule
  ]
})
export class LessonsModule { }
