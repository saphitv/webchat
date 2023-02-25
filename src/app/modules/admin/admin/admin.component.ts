import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin', template: `
    <form [formGroup]="this.form" (ngSubmit)="impersonateUser()">
      <input formControlName="email" type="text" class="input w-full max-w-xs">
      <button type="submit" class="btn btn-primary">Impersona user</button>
    </form>

  `, styles: []
})
export class AdminComponent implements OnInit {

  form: FormGroup = this.fb.group({
    email: ['test@angular-university.io', Validators.required]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
  }

  impersonateUser() {
    this.authService.loginAsUser(this.form.value.email)
      .subscribe(user => {
        console.log("Logged in as user: " + user.email)
        this.router.navigateByUrl('/lessons')
      })
  }
}
