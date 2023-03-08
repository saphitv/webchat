import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  template: `
    <form [formGroup]="this.form" (ngSubmit)="signUp()">
      <h1 class="text-5xl font-bold">Register</h1>
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

  public form: FormGroup = this.fb.group({
    email: ['test@angular-university.io', Validators.required],
    password: ['Test12345', Validators.required],
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
    this.authService.signUp(values.email, values.password).subscribe(
      () => {
        console.log("User created successfully")
        this.router.navigateByUrl('/lessons')
      },
      error => console.log("Utente già esistente")
    )
  }

}
