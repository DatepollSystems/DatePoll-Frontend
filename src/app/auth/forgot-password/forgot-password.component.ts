import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {SigninComponent} from '../signin/signin.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private apiUrl = environment.apiUrl + '/auth/forgotPassword/';
  projectName = SigninComponent.projectName;

  // States: SUBMIT_EMAIL | SUBMIT_CODE | SUBMIT_PASSWORD | FINISHED
  state = 'SUBMIT_EMAIL';

  emailAddress: string;
  verificationCode: number;

  sendingRequest = false;

  unknownEmailAlert = false;
  verificationCodeIncorrect = false;
  verificationCodeRateLimitExceeded = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
  }

  onSubmitForm(form: NgForm) {
    if (this.state.includes('SUBMIT_EMAIL')) {
      this.onSubmitEmail(form);
    } else if (this.state.includes('SUBMIT_CODE')) {
      this.onCheckCode(form);
    } else if (this.state.includes('SUBMIT_PASSWORD')) {
      this.onResetPassword(form);
    } else {
      console.log('forgotPassword | Unknown state: ' + this.state);
    }
  }

  onSubmitEmail(form: NgForm) {
    this.unknownEmailAlert = false;

    const emailAddress = form.controls.email.value;

    const dto = {
      'emailAddress': emailAddress
    };

    this.sendingRequest = true;
    this.http.post(this.apiUrl + 'sendEmail', dto).subscribe(
      (data: any) => {
        console.log(data);
        this.emailAddress = emailAddress;
        this.state = 'SUBMIT_CODE';

        this.sendingRequest = false;
      },
      (error) => {
        console.log(error);
        if (error.error.code != null) {
          if (error.error.code.includes('unknown_email')) {
            this.unknownEmailAlert = true;
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
      'emailAddress': this.emailAddress,
      'code': code
    };

    this.sendingRequest = true;
    this.http.post(this.apiUrl + 'checkCode', dto).subscribe(
      (data: any) => {
        console.log(data);
        this.verificationCode = code;
        this.state = 'SUBMIT_PASSWORD';
        this.sendingRequest = false;
      },
      (error) => {
        console.log(error);
        if (error.error.code != null) {
          if (error.error.code.includes('code_incorrect')) {
            this.verificationCodeIncorrect = true;
          } else if (error.error.code.includes('rate_limit_exceeded')) {
            this.verificationCodeRateLimitExceeded = true;
          }
        }
        this.sendingRequest = false;
      }
    );
  }

  onResetPassword(form: NgForm) {
    const password = form.controls.password.value;

    const dto = {
      'emailAddress': this.emailAddress,
      'code': this.verificationCode,
      'new_password': password
    };

    this.sendingRequest = true;
    this.http.post(this.apiUrl + 'resetPassword', dto).subscribe(
      (data: any) => {
        console.log(data);
        this.state = 'FINISHED';
        this.sendingRequest = false;
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 5000);
      },
      (error) => {
        console.log(error);
        this.sendingRequest = false;
      }
    );
  }

}
