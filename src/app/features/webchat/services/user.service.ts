import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {UserInterface} from "../interfaces/user.interface";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)

  constructor() {
  }

  getUserByUsername(username: string): Observable<UserInterface> {
    return this.http.get('/api/webchat/user', {params: {username: username.toString()}}) as Observable<UserInterface>
  }


}
