import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {combineLatest, filter, map, Observable, tap} from 'rxjs';
import {AuthSelectors} from "../modules/auth/store/selectors/selectors-type";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/reducers/index.reducer";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  store = inject(Store<AppState>)
  router = inject(Router)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return combineLatest([this.store.select(AuthSelectors.isLoggedIn), this.store.select(AuthSelectors.selectIsCheckingIfLoggedIn)]).pipe(
      filter(([isLoggedIn, isChecking]) => !isChecking), // check if it is loading the user from the cookie
      map(([isLoggedIn, isChecking]) => isLoggedIn), // get the isLoggedIn value
      tap((isLoggedIn: boolean) => {
            if(!isLoggedIn) {
              console.log("not logged in")
              this.router.navigateByUrl('/')
            }
      })
    )
  }
}
