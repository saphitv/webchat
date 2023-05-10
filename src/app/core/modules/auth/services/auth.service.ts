import {Injectable} from '@angular/core';
import {catchError, filter, map, Observable, of, ReplaySubject, shareReplay, Subject, tap} from "rxjs";
import {UserInterface} from "../../../../shared/interfaces/user/user.interface";
import {HttpClient} from "@angular/common/http";
import {LoginUserInterface} from "../../../../shared/interfaces/user/loginUser.interface";

export const ANONYMOUS_USER: UserInterface = {
  id: undefined,
  email: '',
  username: '',
  roles: []
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*loadLocalUser(){
    this.store.dispatch(LoginActions.loadUser())
  }

  login(userCredentials: LoginUserInterface){
    this.store.dispatch(LoginActions.userLoggedIn(userCredentials))
  }*/

  checkIfJwtValid(): Observable<UserInterface>{
    return this.http.get<UserInterface>('/api/auth/user')
  }

  login(user: LoginUserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/auth/auth/login', {email: user.email, password: user.password})
  }




  private subject: Subject<UserInterface> = new ReplaySubject<UserInterface>(1)
  user$: Observable<UserInterface> = this.subject.asObservable().pipe(filter(user => !!user));
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.id))
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLogged => !isLogged))

  constructor(private http: HttpClient) {

    /*this.http.get<UserInterface>('/api/user')
      .subscribe(user => {
        console.log("Utente loggato come", user)
        this.subject.next(user ? user : ANONYMOUS_USER)
      })*/
  }

  signUp(username: string, email: string, password: string): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/auth/auth/register/', {username, email, password})
      .pipe(shareReplay(),
        tap(user => this.subject.next(user)),
        catchError(_ => {
          // display errore frontend
          console.log("Errore nella registrazione")
          return of(ANONYMOUS_USER)
        })
      )
  }

  login1(email: string, password: string): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/auth/auth/login', {email, password})
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

  logout() {
    const ref = this.http.post('/api/auth/auth/logout', {}).subscribe(_ => {
      ref.unsubscribe()
    })
  }

  loginAsUser(email: string): Observable<any> {
    return this.http.post<any>('/api/auth/admin/impersonate', {email})
      .pipe(
        shareReplay(),
        tap(user => this.subject.next(user))
      )
  }
}
