import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginActions} from "../../store/actions/actions-type";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../store/reducers/index.reducer";

@Component({
  selector: 'app-register', template: `
    <div
      class="flex flex-col items-center justify-center h-screen w-screen bg-slate-200 dark:bg-dark-primary rounded-l-[25px]">
      <form [formGroup]="this.form" (ngSubmit)="signUp()"
            class="shadow-2xl p-6 rounded-[20px] w-[450px] h-fit bg-white dark:bg-dark-primary">
        <h1 class="text-5xl font-bold mb-6">Register</h1>
        <div class="flex flex-col">
          <input formControlName="username" name="username" type="text" placeholder="Username"
                 class="input w-full my-2 bg-slate-100 dark:bg-[#2a303c]"/>
          <input formControlName="email" name="email" type="text" placeholder="Email"
                 class="input w-full my-2 bg-slate-100 dark:bg-[#2a303c]"/>
          <input formControlName="password" name="password" type="password" placeholder="Password"
                 class="input w-full my-2 bg-slate-100 dark:bg-[#2a303c]"/>
          <button class="btn btn-primary mt-2
              dark:bg-c-red dark:border-c-red dark:hover:bg-c-red dark:hover:border-c-red dark:focus:border-c-red
              bg-c-purple boder-c-purple hover:bg-c-purple hover:border-c-purple focus:border-c-purple">Register
          </button>
        </div>
        <pre *ngIf="this.errors.length">{{this.errors | json}}</pre>
      </form>
    </div>

  `, styles: []
})
export class RegisterComponent implements OnInit {
  store = inject(Store<AppState>)

  public form: FormGroup = this.fb.group({
    email: ['', Validators.required], password: ['', Validators.required], username: ['', Validators.required]
  })

  errors: string[] = []

  constructor(public authService: AuthService, private fb: FormBuilder, private router: Router) {
  }


  ngOnInit(): void {
  }

  signUp() {
    let values = this.form.value
    this.authService.signUp(values.username, values.email, values.password).subscribe(() => {
      this.store.dispatch(LoginActions.userLoggedIn({user: {username: values.username, password: values.password}}))
      console.log("User created successfully")
      this.router.navigateByUrl('/webchat')
    }, error => console.log("Utente già esistente"))
  }

}
