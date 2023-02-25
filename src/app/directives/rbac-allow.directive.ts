import {Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserInterface} from "../interfaces/user.interface";
import {Subscription} from "rxjs";
import * as _ from "lodash"
@Directive({
  selector: '[appRbacAllow]'
})
export class RbacAllowDirective implements OnDestroy {


  allowedRoles: string[] = []
  user?: UserInterface
  sub: Subscription;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private authService: AuthService) {
    this.sub = this.authService.user$.subscribe(user => {
      this.user = user
      this.showIfUserAllowed()
    })
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe()
    }

  @Input()
  set appRbacAllow(allowedRoles: string[]){
    this.allowedRoles = allowedRoles

    this.showIfUserAllowed()
  }

  showIfUserAllowed() {
    if(!this.allowedRoles || this.allowedRoles.length == 0 || !this.user){
      this.viewContainer.clear()
      return;
    }

    const isUserAllowed = _.intersection(this.allowedRoles, this.user.roles).length > 0

    if(isUserAllowed){
      this.viewContainer.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainer.clear()
    }
  }

}
