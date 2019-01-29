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
  private _email;
  private _password;

  constructor(
    private http: Http,
    private router: Router,
    private cookieService: CookieService,
    private snackBar: MatSnackBar) {
  }

  signupUser(email: string, password: string) {
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    //   .catch(
    //     error => console.log(error)
    //   );
  }

  signinUser(email: string, password: string) {
    this._email = email;
    this._password = password;

    const headers = new Headers({'Content-Type': 'application/json'});

    const signInObject = {
      'email': email,
      'password': password
    };

    return this.http.post(this.apiUrl + '/auth/signin', signInObject, {headers: headers});
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
    this.cookieService.put('token', token, {expires: 'Tue, 24-Jan-2050 12:12:12 GMT'});
    this._token = token;
  }

  public isAutenticated(): boolean {
    // TODO: cookie logged in etc
    return this._token != null;
  }
}
