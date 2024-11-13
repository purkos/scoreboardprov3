import { inject, Injectable } from "@angular/core";
import { User } from "../models/user.model";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { enviroment } from "../enviroment/enviroment";
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import { Router } from "@angular/router";
import {ILoginResponse} from '../models/interfaces/ILoginResponse';
import {IRegisterResponse} from '../models/interfaces/IRegisterResponse';
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly apiUrl = enviroment.apiUrl;

  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  //Login
  public login(user: User): Observable<ILoginResponse> {
    const loginUrl = `${this.apiUrl}/account/login`;
    return this.http.post<ILoginResponse>(loginUrl, user).pipe(
        tap((response) => {
          if(response.token) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(true);
          }
        }),
        catchError(this.handleError)
    );
  }

  //Registration
  public register(user: User): Observable<IRegisterResponse> {
    const registerUrl = `${this.apiUrl}/account/register`;
    return this.http.post<any>(registerUrl, user).pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token)
            this.currentUserSubject.next(true);
          }
        }),
        catchError(this.handleError)
    );
  }

  public getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/account/user-info`);
  }
  public logout(): Observable<any> {
    localStorage.removeItem('token');
    this.currentUserSubject.next(false);
    this.router.navigate(['/']);
    return this.http.post(`${this.apiUrl}/account/logout`, {}).pipe(
        catchError(this.handleError)
    );
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public deleteToken(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  public autoLogin(): void {
    if(this.getToken()) {
      this.currentUserSubject.next(true)
    } else {
      this.currentUserSubject.next(false)
    }
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if(!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = decoded.exp * 1000;
      return Date.now() >= expirationDate
    } catch (error) {
      return true;
    }
  }

  public decodeToken(): any | null {
    const token = this.getToken();
    if(token) {
      try {
        return jwtDecode(token)
      } catch (error) {
        console.log('Invalid token', error)
        return null
      }
    }
    return null
  }

  public isAdmin(): boolean {
    const decodedToken = this.decodeToken();
    return decodedToken && decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'Admin';

  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";

    if(error.status === 400 && error.error) {
      errorMessage = error.error.message || "Validation failed";
    } else if (error.status === 401) {
      errorMessage = " Unathorized access - invalid credentials.";
    }
    return throwError(() => new Error(errorMessage))
  }
}
