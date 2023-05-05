import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebchatComponent} from "./webchat.component";

const routes: Routes = [
  { path: ':chat', component: WebchatComponent},
  { path: '', component: WebchatComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebchatRoutingModule { }
