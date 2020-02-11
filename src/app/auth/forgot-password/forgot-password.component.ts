import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';
import {environment} from '../../../environments/environment';
import {SettingsService} from '../../services/settings.service';
import {TranslateService} from '../../translation/translate.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnDestroy {
  communityName: string;
  communityNameSubscription: Subscription;

  // States: SUBMIT_USERNAME | SUBMIT_CODE | SUBMIT_PASSWORD | FINISHED
  state = 'SUBMIT_USERNAME';
  username: string;
  verificationCode: number;
  sendingRequest = false;
  unknownUsernameAlert = false;
  verificationCodeIncorrect = false;
  verificationCodeRateLimitExceeded = false;
  private apiUrl = environment.apiUrl + '/auth/forgotPassword/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.communityName = this.settingsService.getCommunityName();
    this.communityNameSubscription = this.settingsService.communityNameChange.subscribe(value => {
      this.communityName = value;
    });
  }

  ngOnDestroy() {
    this.communityNameSubscription.unsubscribe();
  }

  onSubmitForm(form: NgForm) {
    if (this.state.includes('SUBMIT_USERNAME')) {
      this.onSubmitUsername(form);
    } else if (this.state.includes('SUBMIT_CODE')) {
      this.onCheckCode(form);
    } else if (this.state.includes('SUBMIT_PASSWORD')) {
      this.onResetPassword(form);
    } else {
      console.log('forgotPassword | Unknown state: ' + this.state);
    }
  }

  onSubmitUsername(form: NgForm) {
    this.unknownUsernameAlert = false;

    const username = form.controls.username.value;

    const dto = {
      username: username
    };

    this.sendingRequest = true;
    this.http.post(this.apiUrl + 'sendEmail', dto).subscribe(
      (data: any) => {
        console.log(data);
        this.username = username;
        this.state = 'SUBMIT_CODE';

        this.sendingRequest = false;
      },
      error => {
        console.log(error);
        if (error.error.error_code != null) {
          if (error.error.error_code.includes('unknown_username')) {
            this.unknownUsernameAlert = true;
          }
        }
        this.sendingRequest = false;
      }
    );
  }

  onCheckCode(form: NgForm) {
    this.verificationCodeIncorrect = false;
    this.verificationCodeRateLimitExceeded = false;

    const code = form.controls.emailVerificationCode.value;

    const dto = {
      username: this.username,
      code: code
    };

    this.sendingRequest = true;
    this.http.post(this.apiUrl + 'checkCode', dto).subscribe(
      (data: any) => {
        console.log(data);
        this.verificationCode = code;
        this.state = 'SUBMIT_PASSWORD';
        this.sendingRequest = false;
      },
      error => {
        console.log(error);
        if (error.error.error_code != null) {
          if (error.error.error_code.includes('code_incorrect')) {
            this.verificationCodeIncorrect = true;
          } else if (error.error.error_code.includes('rate_limit_exceeded')) {
            this.verificationCodeRateLimitExceeded = true;
          }
        }
        this.sendingRequest = false;
      }
    );
  }

  onResetPassword(form: NgForm) {
    const password = form.controls.password.value;
    const passwordRepeat = form.controls.password_repeat.value;

    if (password !== passwordRepeat) {
      this.notificationsService.info(
        null,
        this.translate.getTranslationFor('SETTINGS_SECURITY_MODAL_CHANGE_PASSWORD_NEW_PASSWORDS_ARE_NOT_EQUAL')
      );
      return;
    }

    const dto = {
      username: this.username,
      code: this.verificationCode,
      new_password: password
    };

    this.sendingRequest = true;
    this.http.post(this.apiUrl + 'resetPassword', dto).subscribe(
      (data: any) => {
        console.log(data);
        this.state = 'FINISHED';
        this.sendingRequest = false;
        setTimeout(() => {
          this.router.navigate(['/auth/signin']);
        }, 5000);
      },
      error => {
        console.log(error);
        this.sendingRequest = false;
      }
    );
  }
}
