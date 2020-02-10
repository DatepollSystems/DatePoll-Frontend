import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

import {CookieService} from 'ngx-cookie-service';

import {environment} from '../../environments/environment';
import {Browser} from '../services/browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  private sessionToken: string;
  private jwtToken: string;
  jwtTokenExpires: Date;

  private dateIn80Years: Date = new Date();

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private router: Router, private cookieService: CookieService, private http: HttpClient) {
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);

    this.dateIn80Years.setFullYear(this.dateIn80Years.getFullYear() + 80);
  }

  public trySignin(username: string, password: string) {
    const browser = Browser.getInfos();
    const signInObject = {
      username: username,
      password: password,
      stay_logged_in: true,
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile
    };

    return this.http.post(this.apiUrl + '/auth/signin', signInObject, {headers: this.httpHeaders});
  }

  public signin(jwtToken: string, sessionToken: string) {
    this.setJWTToken(jwtToken);
    this.setSessionToken(sessionToken);
  }

  public logout() {
    const object = {
      session_token: this.getSessionToken()
    };

    this.http.post(this.apiUrl + '/v1/user/myself/session/logoutCurrentSession', object, {headers: this.httpHeaders}).subscribe(
      (data: any) => {
        console.log(data);

        this.setSessionToken(null);
        this.setJWTToken(null);
        this.cookieService.deleteAll();
        console.log('authService | Logout successful');

        window.location.reload();
      },
      error => {
        console.log(error);

        this.setSessionToken(null);
        this.setJWTToken(null);
        this.cookieService.deleteAll();

        window.location.reload();
      }
    );
  }

  public refreshJWTToken() {
    const browser = Browser.getInfos();

    const object = {
      session_token: this.getSessionToken(),
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile
    };

    return this.http.post(this.apiUrl + '/auth/IamLoggedIn', object, {headers: this.httpHeaders}).pipe(
      tap((data: any) => {
        this.setJWTToken(data.token);
      })
    );
  }

  setJWTToken(jwtToken: string) {
    if (this.isCookieEnabled()) {
      this.cookieService.set('token', jwtToken, this.dateIn80Years);
    }
    this.jwtToken = jwtToken;
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  public getJWTToken(): string {
    if (this.isCookieEnabled() && this.jwtToken == null) {
      this.jwtToken = this.cookieService.get('token');
    }
    return this.jwtToken;
  }

  getSessionToken(): string {
    if (this.isCookieEnabled() && this.sessionToken == null) {
      this.sessionToken = this.cookieService.get('sessionToken');
    }
    console.log('sessionToken:' + this.sessionToken + '|');
    return this.sessionToken;
  }

  private setSessionToken(sessionToken: string) {
    if (this.isCookieEnabled()) {
      this.cookieService.set('sessionToken', sessionToken, this.dateIn80Years);
    }
    this.sessionToken = sessionToken;
  }

  public isAuthenticated(functionUser: string = 'Unknown'): boolean {
    if (this.getSessionToken()?.length < 1) {
      console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | ERROR: Session token is null');
      return false;
    } else {
      if (this.getJWTToken()?.length < 1) {
        console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | INFO: JWT token is null.');
      }
      console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | INFO: isAuthenticated: true');
      return true;
    }
  }

  public isJWTTokenValid() {
    const currentDate = new Date();
    return currentDate.getTime() < this.jwtTokenExpires.getTime();
  }

  public changePasswordAfterSignin(username: string, oldPassword: string, newPassword: string) {
    const browser = Browser.getInfos();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const changePasswordAfterSigninObject = {
      username: username,
      old_password: oldPassword,
      new_password: newPassword,
      stay_logged_in: true,
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile
    };

    return this.http.post(this.apiUrl + '/auth/changePasswordAfterSignin', changePasswordAfterSigninObject, {headers});
  }

  private isCookieEnabled(): boolean {
    let cookieEnabled = navigator.cookieEnabled;

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }

    return cookieEnabled;
  }
}
