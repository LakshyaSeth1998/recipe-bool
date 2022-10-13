import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';

export interface AuthResponseData {
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn: string;
  localId:string;
  registered?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer:any;

  constructor(private http:HttpClient, private router: Router) { }

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA5S_NxSlp7jzB1MTQq2szx5DHIRZ9aHvo',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(resData => this.handleAuthentication(resData)));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA5S_NxSlp7jzB1MTQq2szx5DHIRZ9aHvo',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(resData => this.handleAuthentication(resData)));
  }

  autoLogin(){
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    }=JSON.parse(localStorage.getItem('userData'));

    if(!userData)return;

    const loadedUser= new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token){
      this.user.next(loadedUser);
      this.autologout(new Date(userData._tokenExpirationDate).getTime()-new Date().getTime());
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  autologout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    },expirationDuration);
  }

  private handleAuthentication(resData: AuthResponseData){
    const expirationDate= new Date(new Date().getTime()+ +resData.expiresIn*1000);
    const user=new User(resData.email,resData.localId,resData.idToken,expirationDate);
    this.user.next(user);
    this.autologout(+resData.expiresIn*1000);
    localStorage.setItem('userData',JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unkown error occured!';
    if(!errorRes.error || !errorRes.error.error)return throwError(errorMessage);
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage='This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage='This email does not exists';
        break;
      case 'INVALID_PASSWORD':
        errorMessage='This password is not correct';
        break;
    }
    return throwError(errorMessage);
  }
}
