import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, first, tap} from 'rxjs';
import {AuthService} from "../../features/auth/services/auth.service";
import * as _ from "lodash"

@Inject({})
export class AuthorizationGuard implements CanActivate {

  constructor(private allowedRoles: string[], private authService: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.user$.pipe(
      map(user => _.intersection(this.allowedRoles, user.roles).length > 0),
      first(),
      tap(allowed => {
        if(!allowed){
          this.router.navigateByUrl('/')
        }
      })
    )
  }

}
