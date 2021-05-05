import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {BrowserHelper} from '../utils/helper/BrowserHelper';
import {UIHelper} from '../utils/helper/UIHelper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  private sessionToken: string;
  private jwtToken: string;
  jwtTokenExpires: Date;

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  public trySignin(username: string, password: string) {
    const browser = BrowserHelper.getInfos();
    const signInObject = {
      username,
      password,
      stay_logged_in: true,
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile,
    };

    return this.http.post(this.apiUrl + '/auth/signin', signInObject, {headers: this.httpHeaders});
  }

  public signin(jwtToken: string, sessionToken: string) {
    this.setJWTToken(jwtToken);
    this.setSessionToken(sessionToken);
  }

  public logout() {
    const object = {
      session_token: this.getSessionToken(),
    };

    this.http.post(this.apiUrl + '/v1/user/myself/session/logoutCurrentSession', object, {headers: this.httpHeaders}).subscribe(
      (data: any) => {
        console.log(data);
        console.log('authService | Logout successful');

        this.clearCookies();
        window.location.reload();
      },
      (error) => {
        this.clearCookies();
        console.log(error);
      }
    );
  }

  public clearCookies() {
    this.setSessionToken(null);
    this.setJWTToken(null);
    localStorage.clear();
  }

  public refreshJWTToken() {
    const browser = BrowserHelper.getInfos();

    const object = {
      session_token: this.getSessionToken(),
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile,
    };

    return this.http.post(this.apiUrl + '/auth/IamLoggedIn', object, {headers: this.httpHeaders}).pipe(
      tap((data: any) => {
        this.setJWTToken(data.token);
      })
    );
  }

  public setJWTToken(jwtToken: string) {
    localStorage.setItem('token', jwtToken);
    this.jwtToken = jwtToken;
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  public getJWTToken(): string {
    if (this.jwtToken == null) {
      this.jwtToken = localStorage.getItem('token');
    }
    return this.jwtToken;
  }

  getSessionToken(): string {
    if (this.sessionToken == null) {
      this.sessionToken = localStorage.getItem('sessionToken');
    }
    return this.sessionToken;
  }

  public setSessionToken(sessionToken: string) {
    localStorage.setItem('sessionToken', sessionToken);
    this.sessionToken = sessionToken;
  }

  public isAuthenticated(functionUser: string = 'Unknown'): boolean {
    if (this.getSessionToken() == null) {
      console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | ERROR: Session token is null');
      return false;
    } else {
      if (this.getJWTToken() == null) {
        console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | INFO: JWT token is null.');
      }
      console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | INFO: isAuthenticated: true');
      return true;
    }
  }

  public isJWTTokenValid() {
    if (this.getJWTToken() == null) {
      return false;
    }

    return UIHelper.getCurrentDate().getTime() < this.jwtTokenExpires.getTime();
  }

  public changePasswordAfterSignin(username: string, oldPassword: string, newPassword: string) {
    const browser = BrowserHelper.getInfos();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const changePasswordAfterSigninObject = {
      username,
      old_password: oldPassword,
      new_password: newPassword,
      stay_logged_in: true,
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile,
    };

    return this.http.post(this.apiUrl + '/auth/changePasswordAfterSignin', changePasswordAfterSigninObject, {headers});
  }
}
