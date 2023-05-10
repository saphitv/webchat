import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthState} from "../../store/reducers/index.reducer";
import {Store} from "@ngrx/store";
import {LoginActions} from "../../store/actions/actions-type";
import {Observable, Subscription} from "rxjs";
import {AuthSelectors} from "../../store/selectors/selectors-type";

@Component({
  selector: 'app-login', template: `
    <div
      class="flex flex-col items-center justify-center h-screen w-screen bg-slate-200 dark:bg-dark-primary rounded-l-[25px]">
      <form [formGroup]="this.form" (ngSubmit)="login()"
            class="shadow-2xl p-6 rounded-[20px] w-[450px] h-fit bg-white dark:bg-dark-primary">
        <h1 class="text-5xl font-bold mb-6">Login</h1>
        <div class="flex flex-col">
          <input formControlName="email" type="text" placeholder="Email"
                 class="input w-full my-2 bg-slate-100 dark:bg-[#2a303c]"/><br>
          <input formControlName="password" type="password" placeholder="Password"
                 class="input w-full my-2 bg-slate-100 dark:bg-[#2a303c]"/><br>
          <button class="btn btn-primary mt-2
              dark:bg-c-red dark:!border-c-red dark:hover:bg-c-red dark:hover:border-c-red dark:focus-visible:!border-c-red
              bg-c-purple border-c-purple hover:bg-c-purple hover:border-c-purple focus-visible:!border-c-purple">Login
          </button>
        </div>

      </form>
    </div>
  `, styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoggedIn$: Observable<boolean> = this.store.select(AuthSelectors.isLoggedIn)

  subs: Subscription[] = []

  public form: FormGroup = this.fb.group({
    email: ['', Validators.required], password: ['', Validators.required],
  })

  constructor(private fb: FormBuilder, private store: Store<AuthState>, private router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigateByUrl('webchat')
      }

    })
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) this.store.dispatch(LoginActions.userLoggedIn({
      user: {
        email: val.email,
        password: val.password
      }
    }))
  }

}
