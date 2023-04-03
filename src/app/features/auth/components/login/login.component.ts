import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthState} from "../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {LoginActions} from "../../store/actions/actions-type";
import {Observable, Subscription} from "rxjs";
import {AuthSelectors} from "../../store/selectors/selectors-type";

@Component({
  selector: 'app-login',
  template: `
      <form [formGroup]="this.form" (ngSubmit)="login()">
          <h1 class="text-5xl font-bold">Login</h1>
          <input formControlName="email" type="text" placeholder="email" class="input w-full max-w-xs"/>
          <input formControlName="password" type="password" placeholder="Password" class="input w-full max-w-xs"/>
          <button class="btn btn-primary">Login</button>
      </form>
  `,
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoggedIn$: Observable<boolean> = this.store.select(AuthSelectors.isLoggedIn)

  subs: Subscription[] = []

  public form: FormGroup = this.fb.group({
    email: ['simonmaggini@gmail.com', Validators.required],
    password: ['S280575n*', Validators.required],
  })

  constructor(private fb: FormBuilder, private store: Store<AuthState>, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if(isLoggedIn)
        this.router.navigateByUrl('webchat')
    })
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  login(){
    const val = this.form.value;

    if(val.email && val.password)
      this.store.dispatch(LoginActions.userLoggedIn({user: {email: val.email, password: val.password}}))
  }

}
