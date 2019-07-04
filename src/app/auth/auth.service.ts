import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';

import {CookieService} from 'angular2-cookie/core';

import {environment} from '../../environments/environment';
import {Browser} from '../services/browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private _hasSessionToken = false;
  private _sessionToken: string = null;
  private _token: string = null;

  private timeIn5Minutes: Date = new Date(new Date().getTime() - 5 * 60000);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private snackBar: MatSnackBar) {

    this.getJWTTokenBySessionToken();
  }

  public signinUser(username: string, password: string, stayLoggedIn: boolean) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    let signInObject;

    const browser = Browser.getInfos();

    if (stayLoggedIn) {
      signInObject = {
        'username': username,
        'password': password,
        'stayLoggedIn': stayLoggedIn,
        'sessionInformation': browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os +
          '; Phone: ' + browser.mobile
      };
    } else {
      signInObject = {
        'username': username,
        'password': password
      };
    }

    return this.http.post(this.apiUrl + '/auth/signin', signInObject, {headers: headers});
  }

  public performLogin(token: string, sessionToken = null) {
    if (sessionToken != null) {
      this.setSessionToken(sessionToken);
    }

    this.setToken(token);
    console.log('signIn | token: ' + token);
    this.router.navigate(['/home']);
  }

  public changePasswordAfterSignin(username: string, oldPassword: string, newPassword: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const changePasswordAfterSigninObject = {
      'username': username,
      'old_password': oldPassword,
      'new_password': newPassword
    };

    return this.http.post(this.apiUrl + '/auth/changePasswordAfterSignin', changePasswordAfterSigninObject, {headers: headers});
  }

  public logout(deleteSessionToken = true) {
    if (this.isCookieEnabled()) {
      if (this._sessionToken != null && deleteSessionToken) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const object = {
          'sessionToken': this._sessionToken
        };

        this.http.post(this.apiUrl + '/v1/user/myself/session/logoutCurrentSession?token=' + this._token, object,
          {headers: headers}).subscribe(
          (data: any) => {
            console.log(data);
            this._token = null;
            this._sessionToken = null;
            this.router.navigate(['/auth/signin']);
            window.location.reload();
            console.log('authService | Logout successful');
          },
          (error) => console.log(error)
        );
      }

      this.cookieService.removeAll();
    } else {
      this._token = null;
      this._sessionToken = null;
      this.router.navigate(['/auth/signin']);
      console.log('authService | Logout successful');
      window.location.reload();
    }
  }

  public getToken(functionUser: string = null): string {
    if (this._token == null) {
      this._token = this.cookieService.get('token');

      if (functionUser != null) {
        console.log('authService | ' + functionUser + ' | get token from cookie: ' + this._token);
      } else {
        console.log('authService | get token from cookie: ' + this._token);
      }
    }

    const now = new Date();

    if (this.timeIn5Minutes < now) {
      this.timeIn5Minutes = new Date(new Date().getTime() + 5 * 60000);

      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      const refreshObject = {
        'token': this._token
      };
      this.http.post(this.apiUrl + '/auth/refresh?token=' + this._token, refreshObject, {headers: headers}).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError((error) => {
          console.log(error);

          return throwError('authService | Could not refresh jwt token!');
        })
      ).subscribe(
        (data: any) => {
          console.log(data);
          this.setToken(data.token);
          if (functionUser != null) {
            console.log('authService | ' + functionUser + ' | getToken | refresh | new token: ' + data.token);
          } else {
            console.log('authService | getToken | refresh | new token: ' + data.token);
          }
        },
        (error) => {
          console.log(error);
          if (this._hasSessionToken) {
            console.log('authService | Trying to refresh jwt token...');
            this.getJWTTokenBySessionToken();
          } else {
            // The most probable thing which happened is that the token is not longer valid
            this.router.navigate(['/auth/signin']);
            this.snackBar.open('Bitte melde dich erneut an!');
          }
        }
      );
    } else {
      console.log('authService | getToken | not refreshing | | ' + functionUser + ' | Refreshing in: ' +
        ((this.timeIn5Minutes.getTime() - now.getTime()) / 60000).toFixed(2) + ' minutes');
    }

    return this._token;
  }

  public setToken(token: string) {
    if (this.isCookieEnabled()) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 60);

      this.cookieService.put('token', token, {expires: date});
    }
    this._token = token;
  }

  public setSessionToken(token: string) {
    if (this.isCookieEnabled()) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 80);

      this.cookieService.put('sessionToken', token, {expires: date});
    }
    this._sessionToken = token;
  }

  public isAuthenticated(functionUser: string = 'Unknown'): boolean {
    let result = false;

    if (this.isCookieEnabled()) {
      if (this.cookieService.get('token') == null) {
        result = false;
      } else {
        this._token = this.cookieService.get('token');
        result = true;
      }
    }

    if (this._token == null) {
      result = false;
    }

    console.log('authService | isAuthenticated | Funtion User: ' + functionUser + ' | Result: ' + result);

    return result;
  }

  private getJWTTokenBySessionToken() {
    if (this.isCookieEnabled()) {
      if (this.cookieService.get('sessionToken') == null) {
        this._hasSessionToken = false;
      } else {
        this._hasSessionToken = true;
        this._sessionToken = this.cookieService.get('sessionToken');
      }
    } else {
      this._hasSessionToken = false;
    }

    if (this._hasSessionToken) {
      console.log('authService | Using existing session token...');

      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      const browser = Browser.getInfos();

      const object = {
        'sessionToken': this._sessionToken,
        'sessionInformation': browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os +
          '; Phone: ' + browser.mobile
      };

      this.http.post(this.apiUrl + '/auth/IamLoggedIn', object, {headers: headers}).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError((error) => {
          console.log(error);
          console.log('authService | sessionToken is not valid anymore!');
          // Logged out or deleted session
          this.logout(false);

          return throwError('authService | Error on request IamLoggedIn');
        })
      ).subscribe(
        (data: any) => {
          console.log(data);

          const hadToken = (this._token != null || this.cookieService.get('token'));

          this.setToken(data.token);
          console.log('authService | IamLoggedIn | Successful | JWT Token: ' + this._token);
          if (!hadToken) {
            this.router.navigate(['/home']);
          }
        }
      );
    } else if (!this._hasSessionToken && this._token == null && this.cookieService.get('token') == null) {
      this.router.navigate(['/auth/signin']);
    }
  }

  private isCookieEnabled(): boolean {
    let cookieEnabled = (navigator.cookieEnabled);

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }

    return cookieEnabled;
  }
}
