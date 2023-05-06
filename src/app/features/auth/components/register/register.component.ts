import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginActions} from "../../store/actions/actions-type";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/reducers/index.reducer";

@Component({
  selector: 'app-register',
  template: `
    <form [formGroup]="this.form" (ngSubmit)="signUp()">
      <h1 class="text-5xl font-bold">Register</h1>
      <input formControlName="username" name="username" type="text" placeholder="username"
             class="input w-full max-w-xs"/>
      <input formControlName="email" name="email" type="text" placeholder="email" class="input w-full max-w-xs"/>
      <input formControlName="password" name="password" type="password" placeholder="Password"
             class="input w-full max-w-xs"/>
      <button class="btn btn-primary">Register</button>
      <pre *ngIf="this.errors.length">{{this.errors | json}}</pre>
    </form>

  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  store = inject(Store<AppState>)

  public form: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    username: ['', Validators.required]
  })

  errors: string[] = []

  constructor(public authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
  }


  ngOnInit(): void {
  }

  signUp() {
    let values = this.form.value
    this.authService.signUp(values.username, values.email, values.password).subscribe(
      () => {
        this.store.dispatch(LoginActions.userLoggedIn({user: {email: values.email, password: values.password}}))
        console.log("User created successfully")
        this.router.navigateByUrl('/webchat')
      },
      error => console.log("Utente già esistente")
    )
  }

}
