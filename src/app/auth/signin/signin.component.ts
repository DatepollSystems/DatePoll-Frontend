import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth.service';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
  communityName: string;
  communityNameSubscription: Subscription;

  state = 'login';

  loginSuccess = false;
  loginFail = false;

  showLoadingSpinnerDuringLogin = false;

  private username: string;
  private password: string;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private settingsService: SettingsService) {
    this.communityName = this.settingsService.getCommunityName();
    this.communityNameSubscription = this.settingsService.communityNameChange.subscribe((value) => {
      this.communityName = value;
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated('signInComponent')) {
      console.log('signInComponent | isAuthenticated | Routing user to /home');
      this.router.navigate(['/home']);
    } else {
      console.log('signInComponent | isAuthenticated | Do not route user to /home ');
    }
  }

  ngOnDestroy(): void {
    this.communityNameSubscription.unsubscribe();
  }

  protected onSignin(form: NgForm) {
    this.showLoadingSpinnerDuringLogin = true;

    this.username = form.value.username;
    this.password = form.value.password;

    this.authService.trySignin(this.username, this.password).subscribe(
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

        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
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
        console.log(data);
        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
      }, (error) => console.log(error)
    );
  }

  private uiLogin() {
    this.loginSuccess = true;
    this.loginFail = false;
    this.snackBar.open('Login erfolgreich');
    this.router.navigate(['/home']);
  }

}
