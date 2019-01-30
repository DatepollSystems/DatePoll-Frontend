import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {CookieService} from 'angular2-cookie/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private _token: string = null;

  constructor(
    private http: Http,
    private router: Router,
    private cookieService: CookieService,
    private snackBar: MatSnackBar) {
  }

  public signupUser(email: string, password: string) {
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    //   .catch(
    //     error => console.log(error)
    //   );
  }

  public signinUser(email: string, password: string) {
    const headers = new Headers({'Content-Type': 'application/json'});

    const signInObject = {
      'email': email,
      'password': password
    };

    return this.http.post(this.apiUrl + '/auth/signin', signInObject, {headers: headers});
  }

  public changePasswordAfterSignin(email: string, oldPassword: string, newPassword: string) {
    const headers = new Headers({'Content-Type': 'application/json'});

    const changePasswordAfterSigninObject = {
      'email': email,
      'old_password': oldPassword,
      'new_password': newPassword
    };

    return this.http.post(this.apiUrl + '/auth/changePasswortAfterSignin', changePasswordAfterSigninObject, {headers: headers});
  }

  public logout() {
    let cookieEnabled = (navigator.cookieEnabled);

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }

    if (cookieEnabled) {
      this.cookieService.remove('token');
    }

    this._token = null;
    console.log('authService | Logout successful');
    return true;
  }

  public getToken(): string {
    if (this._token == null && this.cookieService.get('token') == null) {
      this.router.navigate(['/signin']);
    } else if (this._token == null) {
      this._token = this.cookieService.get('token');
      console.log('authService | get token from cookie: ' + this._token);
    }

    const headers = new Headers({'Content-Type': 'application/json'});

    const refreshObject = {
      'token': this._token
    };
    this.http.post(this.apiUrl + '/auth/refresh?token=' + this._token, refreshObject, {headers: headers}).subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.setToken(data.token);
        console.log('authService | getToken | refresh | new token: ' + data.token);
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
    let cookieEnabled = (navigator.cookieEnabled);

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }

    const twentyMinutesLater = new Date();
    twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 60);

    if (cookieEnabled) {
      this.cookieService.put('token', token, {expires: twentyMinutesLater});
    }
    this._token = token;
  }

  public isAutenticated(): boolean {
    let cookieEnabled = (navigator.cookieEnabled);

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }

    if (cookieEnabled) {
      console.log('authService | Cookies enabled!');
      if (this.cookieService.get('token') == null) {
        return false;
      } else {
        this._token = this.cookieService.get('token');
      }
    }

    return this._token != null;
  }
}
