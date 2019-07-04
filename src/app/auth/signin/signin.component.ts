import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AuthService} from '../auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public static projectName = 'DatePoll - Web';
  projectName = SigninComponent.projectName;

  apiUrl = environment.apiUrl;

  state = 'login';

  loginSuccess = false;
  loginFail = false;

  showLoadingSpinnerDuringLogin = false;

  private username: string;
  private password: string;
  private stayLoggedIn = false;

  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService, private http: HttpClient) {
    this.http.get(this.apiUrl + '/settings/name').subscribe(
      (response: any) => {
        console.log(response);
        SigninComponent.projectName = response.community_name;
        this.projectName = SigninComponent.projectName;
      }
    );
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated('signInComponent')) {
      console.log('signInComponent | isAuthenticated | Routing user to /home');
      this.router.navigate(['/home']);
    } else {
      console.log('signInComponent | isAuthenticated | Do not route user to /home ');
    }
  }

  protected onSignin(form: NgForm) {
    this.showLoadingSpinnerDuringLogin = true;

    this.username = form.value.username;
    this.password = form.value.password;

    console.log('signInComponent | Stay logged in: ' + this.stayLoggedIn);

    this.authService.signinUser(this.username, this.password, this.stayLoggedIn).subscribe(
      (data: any) => {
        console.log(data);
        if (data.msg != null) {
          if (data.msg === 'notActivated') {
            this.state = data.msg;
          }

          if (data.msg === 'changePassword') {
            this.state = data.msg;
          }

          this.showLoadingSpinnerDuringLogin = false;
          return;
        }

        this.uiLogin();
        if (data.sessionToken != null) {
          this.authService.performLogin(data.token, data.sessionToken);
        } else {
          this.authService.performLogin(data.token);
        }
      },
      (error) => {
        console.log(error);
        this.showLoadingSpinnerDuringLogin = false;

        this.loginFail = true;
        this.loginSuccess = false;
      }
    );
  }

  protected onChangePasswordAfterSignin(form: NgForm) {
    const password = form.value.password;

    this.authService.changePasswordAfterSignin(this.username, this.password, password).subscribe(
      (data: any) => {
        this.uiLogin();
        this.authService.performLogin(data.token);
      }, (error) => console.log(error)
    );
  }

  private uiLogin() {
    this.loginSuccess = true;
    this.loginFail = false;
    this.snackBar.open('Login erfolgreich');
  }

}
