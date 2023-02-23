import {Injectable} from '@angular/core';
import {catchError, filter, map, Observable, of, ReplaySubject, shareReplay, Subject, tap} from "rxjs";
import {UserInterface} from "../interfaces/user.interface";
import {HttpClient} from "@angular/common/http";

export const ANONYMOUS_USER: UserInterface = {
  id: undefined,
  email: '',
  roles: []
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private subject: Subject<UserInterface> = new ReplaySubject<UserInterface>(1)
  user$: Observable<UserInterface> = this.subject.asObservable().pipe(filter(user => !!user));
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.id))
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLogged => !isLogged))

  constructor(private http: HttpClient) {
    this.http.get<UserInterface>('/api/user')
      .subscribe(user => {
        console.log(user)
        this.subject.next(user ? user : ANONYMOUS_USER)
      })
  }

  signUp(email: string, password: string): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/auth/register', {email, password})
      .pipe(shareReplay(),
        tap(user => this.subject.next(user)),
        catchError(_ => {
          // display errore frontend
          console.log("Errore nella registrazione")
          return of(ANONYMOUS_USER)
        })
      )
  }

  login(email: string, password: string): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/auth/login', {email, password})
      .pipe(
        shareReplay(),
        tap(user => {
          this.subject.next(user)
        }),
        catchError(_ => {
          // display errore frontend
          console.log("Errore nel login")
          return of(ANONYMOUS_USER)
        })
      )
  }

  logout(): Observable<any> {
    return this.http.post('/api/auth/logout', {})
      .pipe(
        shareReplay(),
        tap(() => this.subject.next(ANONYMOUS_USER))
      )
  }

  loginAsUser(email: string): Observable<any> {
    return this.http.post<any>('/api/admin/impersonate', {email})
      .pipe(
        shareReplay(),
        tap(user => this.subject.next(user))
      )
  }
}
