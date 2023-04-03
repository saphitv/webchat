import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsLoggedInGuard} from "./core/guard/is-logged-in.guard";

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'lessons', loadChildren: () => import('./features/lessons/lessons.module').then(m => m.LessonsModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), canActivate: ["adminsOnlyGuard"]},
  { path: 'webchat', loadChildren: () => import('./features/webchat/webchat.module').then(m => m.WebchatModule), canActivate: [IsLoggedInGuard]},
  { path: '**', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
