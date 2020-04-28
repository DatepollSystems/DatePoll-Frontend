import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../utils/settings.service';
import {AuthService} from '../auth.service';
import {MobileAppBottomSheetComponent} from './mobile-app-bottom-sheet/mobile-app-bottom-sheet.component';

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

  changePasswordAfterSigninForm = this.fb.group({
    passwords: this.fb.group(
      {
        password: ['', [Validators.required, Validators.min(6)]],
        repeat: ['', [Validators.required, Validators.min(6)]]
      },
      {validator: this.checkPasswords}
    )
  });

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private bottomSheet: MatBottomSheet,
    private settingsService: SettingsService,
    private fb: FormBuilder
  ) {
    this.communityName = this.settingsService.getCommunityName();
    this.communityNameSubscription = this.settingsService.communityNameChange.subscribe(value => {
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

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const pass = group.get('password').value;
    if (pass?.length < 6) {
      return {wrongLength: true};
    }
    const confirmPass = group.get('repeat').value;

    return pass === confirmPass ? null : {notSame: true};
  }

  openMobileAppBottomSheet() {
    this.bottomSheet.open(MobileAppBottomSheetComponent);
  }

  protected onSignin(form: NgForm) {
    this.showLoadingSpinnerDuringLogin = true;

    this.username = form.value.username;
    this.password = form.value.password;

    this.authService.trySignin(this.username, this.password).subscribe(
      (data: any) => {
        console.log(data);
        if (data.error_code != null) {
          if (data.error_code === 'notActivated') {
            this.state = data.error_code;
          }

          if (data.error_code === 'changePassword') {
            this.state = data.error_code;
          }

          this.showLoadingSpinnerDuringLogin = false;
          return;
        }

        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
      },
      error => {
        console.log(error);
        this.showLoadingSpinnerDuringLogin = false;

        this.loginFail = true;
        this.loginSuccess = false;
      }
    );
  }

  protected onChangePasswordAfterSignin(form: FormGroup) {
    const password = form.controls.passwords.get('password').value;

    this.authService.changePasswordAfterSignin(this.username, this.password, password).subscribe(
      (data: any) => {
        console.log(data);
        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
      },
      error => console.log(error)
    );
  }

  private uiLogin() {
    this.loginSuccess = true;
    this.loginFail = false;
    this.snackBar.open('Login erfolgreich');
    this.router.navigate(['/home']);
  }
}
