import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

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
export class LoginComponent implements OnInit {

  public form: FormGroup = this.fb.group({
    email: ['test@angular-university.io', Validators.required],
    password: ['Test12345', Validators.required],
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    const val = this.form.value;

    if(val.email && val.password){
      this.authService.login(val.email, val.password)
        .subscribe(() => {
          console.log("User is logged in")
          this.router.navigateByUrl('/lessons')
        })
    }
  }

}
