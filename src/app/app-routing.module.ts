import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsLoggedInGuard} from "./core/guard/is-logged-in.guard";

const routes: Routes = [
  {path: 'auth', loadChildren: () => import('./core/modules/auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'webchat',
    loadChildren: () => import('./features/webchat/webchat.module').then(m => m.WebchatModule),
    canActivate: [IsLoggedInGuard]
  },
  {path: '**', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
