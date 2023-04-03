import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {AuthService} from "../../features/auth/services/auth.service";
import {AuthSelectors} from "../../features/auth/store/selectors/selectors-type";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/reducers/index.reducer";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(AuthSelectors.isLoggedIn).pipe(
      tap((isLoggedIn: boolean) => {
        if(!isLoggedIn)
          this.router.navigateByUrl('')
      })
    )
  }

  constructor(private store: Store<AppState>, private router: Router) {
  }

}
