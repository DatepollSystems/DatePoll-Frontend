import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {CookieService} from 'angular2-cookie/core';
import {MatSnackBar} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private _hasSessionToken = false;
  private _sessionToken: string = null;
  private _token: string = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private snackBar: MatSnackBar) {

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

      const browser = get_browser_info();

      const object = {
        'sessionToken': this._sessionToken,
        'sessionInformation': browser.name + '; ' + browser.version
      };

      this.http.post(this.apiUrl + '/auth/IamLoggedIn', object, {headers: headers}).subscribe(
        (data: any) => {
          console.log(data);

          this.setToken(data.token);
          console.log('authService | IamLoggedIn | Successful | JWT Token: ' + this._token);
        },
        (error) => {
          console.log(error);
          console.log('authService | sessionToken is not valid anymore!');
          // Logged out or deleted session
          this.logout(false);
        }
      );
    }
  }

  public signinUser(email: string, password: string, stayLoggedIn: boolean) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    let signInObject;

    const browser = get_browser_info();

    if (stayLoggedIn) {
      signInObject = {
        'email': email,
        'password': password,
        'stayLoggedIn': stayLoggedIn,
        'sessionInformation': browser.name + '; ' + browser.version
      };
    } else {
      signInObject = {
        'email': email,
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

  public changePasswordAfterSignin(email: string, oldPassword: string, newPassword: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const changePasswordAfterSigninObject = {
      'email': email,
      'old_password': oldPassword,
      'new_password': newPassword
    };

    return this.http.post(this.apiUrl + '/auth/changePasswortAfterSignin', changePasswordAfterSigninObject, {headers: headers});
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
          },
          (error) => console.log(error)
        );
      }

      this.cookieService.removeAll();
    }

    this._token = null;
    this._sessionToken = null;
    console.log('authService | Logout successful');
    this.router.navigate(['/signin']);
  }

  public getToken(functionUser: string = null): string {
    if (this._token == null && this.cookieService.get('token') == null) {
      this.router.navigate(['/signin']);
    } else if (this._token == null) {
      this._token = this.cookieService.get('token');

      if (functionUser != null) {
        console.log('authService | ' + functionUser + ' | get token from cookie: ' + this._token);
      } else {
        console.log('authService | get token from cookie: ' + this._token);
      }
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const refreshObject = {
      'token': this._token
    };
    this.http.post(this.apiUrl + '/auth/refresh?token=' + this._token, refreshObject, {headers: headers}).subscribe(
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
        // The most probable thing which happened is that the token is not longer valid
        this.router.navigate(['/signin']);
        this.snackBar.open('Bitte melde dich erneut an!');
      }
    );

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

  public isAuthenticated(functionUser: string = null): boolean {
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

  private isCookieEnabled(): boolean {
    let cookieEnabled = (navigator.cookieEnabled);

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }

    return cookieEnabled;
  }
}

function get_browser_info() {
  const ua = navigator.userAgent;
  let tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE ', version: (tem[1] || '')};
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
}
