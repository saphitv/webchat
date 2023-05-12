import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebchatComponent} from "./webchat.component";
import {UserProfileComponent} from "./components/user-profile.component";

const routes: Routes = [
  {path: 'user/:username', component: UserProfileComponent},
  {path: 'group/:groupname', component: WebchatComponent},
  {path: ':username', component: WebchatComponent},
  {path: '', component: WebchatComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebchatRoutingModule { }
