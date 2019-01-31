import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Response} from '@angular/http';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  projectName = 'priv. uni. Buergerkorps Eggenburg';

  state = 'login';

  loginSuccess = false;
  loginFail = false;
  showPasswordEqaulsAlert = false;

  private email: string;
  private password: string;

  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.authService.isAutenticated('signInComponent')) {
      this.router.navigate(['/home']);
    }
  }

  protected onSignin(form: NgForm) {
    this.email = form.value.email;
    this.password = form.value.password;

    this.authService.signinUser(this.email, this.password).subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        if (data.msg != null) {
          if (data.msg === 'changePassword') {
            this.state = data.msg;
          }

          return;
        }

        this.performLogin(data.token);
      },
      (error) => {
        console.log(error);
        this.loginFail = true;
        this.loginSuccess = false;
      }
    );
  }

  protected onChangePasswordAfterSignin(form: NgForm) {
    const password = form.value.password;
    const password_repeat = form.value.password_repeat;

    if (password !== password_repeat) {
      this.showPasswordEqaulsAlert = true;
      return;
    }
    this.showPasswordEqaulsAlert = false;

    this.authService.changePasswordAfterSignin(this.email, this.password, password).subscribe(
      (response: Response) => {
        const data = response.json();
        this.performLogin(data.token);
      }, (error) => console.log(error)
    );
  }

  private performLogin(token: string) {
    this.authService.setToken(token);
    console.log('signIn | token: ' + token);
    this.loginSuccess = true;
    this.loginFail = false;
    this.router.navigate(['/home']);
    this.snackBar.open('Login erfolgreich');
  }

}
