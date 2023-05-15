import {Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {first, map, Observable, tap} from 'rxjs';
import {AuthService} from "../modules/auth/services/auth.service";

// import * as _ from 'lodash';
@Inject({})
export class AuthorizationGuard implements CanActivate {

  constructor(private allowedRoles: string[], private authService: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.user$.pipe(
      /* map(user => _.intersection(this.allowedRoles, user.roles).length > 0), */
      map(user => this.intersect(this.allowedRoles, user.roles).length > 0),
      first(),
      tap(allowed => {
        if(!allowed){
          console.log("not allowed")
          this.router.navigateByUrl('/')
        }
      })
    )
  }

  intersect(a: any, b: any) {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    return Array.from(intersection);
  }

}


