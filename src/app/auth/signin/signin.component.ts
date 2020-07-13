import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../utils/settings.service';
import {AuthService} from '../auth.service';

import {MobileAppBottomSheetComponent} from './mobile-app-bottom-sheet/mobile-app-bottom-sheet.component';

import {ServerInfoModel} from '../../utils/server-info.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnDestroy {
  serverInfo: ServerInfoModel;
  serverInfoSubscription: Subscription;

  state = 'login';

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
    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe(value => {
      this.serverInfo = value;
    });

    const state = window.history.state;
    if (state?.routingReason) {
      switch (state.routingReason) {
        case 'forward':
          this.state = state.state;
          this.username = state.username;
          this.password = state.password;
          break;
        case 'loginFailed':
          this.loginFail = true;
          this.username = state.username;
          this.password = state.password;
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
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

        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
      },
      error => {
        console.log(error);
        this.showLoadingSpinnerDuringLogin = false;
        if (error.error.error_code != null) {
          if (error.error.error_code === 'not_activated' || error.error.error_code === 'change_password') {
            this.state = error.error.error_code;
            return;
          }
        }

        this.loginFail = true;
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
    this.loginFail = false;
    this.snackBar.open('Login erfolgreich');
    this.router.navigate(['/home']);
  }
}
