import {Component, ViewChild} from '@angular/core';
import {Response} from '@angular/http';

import {MyUserService} from '../../my-user.service';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent {

  @ViewChild('stepper') stepper;

  oldEmailVerificationCode: number;

  newEmailAddress: string;
  newEmailVerificationCode: number;

  showOldEmailVerificiationEmailSendingSpinner = false;
  showOldEmailVerificationCodeIncorrectCard = false;
  showOldEmailVerificationCodeRateLimitExceededCard = false;

  showNewEmailVerificationEmailSendingSpinner = false;
  showNewEmailIsOldEmailCard = false;
  showNewEmailVerificationCodeIncorrectCard = false;
  showNewEmailVerificationCodeRateLimitExceededCard = false;

  constructor(
    private _myUserService: MyUserService,
    private httpService: HttpService) {
  }

  nextStep() {
    this.stepper.selectedIndex++;
  }

  sendOldEmailVerification() {
    this.showOldEmailVerificiationEmailSendingSpinner = true;

    this.httpService.loggedInV1GETRequest('/user/myself/changeEmail/oldEmailAddressVerification', 'sendOldEmailVerification').subscribe(
      (response: any) => {
        if (response.msg === 'Sent') {
          this.nextStep();
        }
      },
      (error) => {
        console.log(error);
        console.log('sendOldEmailVerification | Email was not sent!');
      }
    );
  }

  checkOldEmailVerificationCode() {
    this.showOldEmailVerificationCodeIncorrectCard = false;
    this.showOldEmailVerificationCodeRateLimitExceededCard = false;

    const body = {
      'code': this.oldEmailVerificationCode,
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changeEmail/oldEmailAddressVerificationCodeVerification',
      body,
      'checkOldEmailVerificationCode')
      .subscribe(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          const msg = data.msg;

          switch (msg) {
            case 'code_correct':
              this.nextStep();
              break;

            case 'code_incorrect':
              console.log('checkOldEmailVerificationCode | Code incorrect | Code: ' + this.oldEmailVerificationCode);
              this.showOldEmailVerificationCodeIncorrectCard = true;

              break;

            case 'rate_limit_exceeded':
              console.log('checkOldEmailVerificationCode | Rate limit exceeded');
              this.showOldEmailVerificationCodeRateLimitExceededCard = true;

              break;

            default:
              console.log(msg);
              break;
          }
        },
        (error) => {
          console.log(error);
          this.showOldEmailVerificationCodeIncorrectCard = true;
        }
      );
  }

  sendNewEmailVerification() {
    this.showNewEmailIsOldEmailCard = false;

    if (this.newEmailAddress === this._myUserService.getEmail()) {
      this.showNewEmailIsOldEmailCard = true;
      return;
    }

    this.showNewEmailVerificationEmailSendingSpinner = true;

    const body = {
      'email': this.newEmailAddress
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changeEmail/newEmailAddressVerification', body,
      'sendNewEmailVerification').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);

        if (data.msg === 'Sent') {
          this.nextStep();
        }
      },
      (error) => {
        console.log(error);
        console.log('sendNewEmailVerification | Email was not sent!');
      }
    );
  }

  checkNewEmailVerificationCode() {
    this.showNewEmailVerificationCodeIncorrectCard = false;
    this.showNewEmailVerificationCodeRateLimitExceededCard = false;

    const body = {
      'code': this.newEmailVerificationCode,
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changeEmail/newEmailAddressVerificationCodeVerification',
      body,
      'checkNewEmailVerificationCode')
      .subscribe(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          const msg = data.msg;

          switch (msg) {
            case 'code_correct':
              this.changeEmail();
              break;

            case 'code_incorrect':
              console.log('checkNewEmailVerificationCode | Code incorrect | Code: ' + this.newEmailVerificationCode);
              this.showNewEmailVerificationCodeIncorrectCard = true;

              break;

            case 'rate_limit_exceeded':
              console.log('checkNewEmailVerificationCode | Rate limit exceeded');
              this.showNewEmailVerificationCodeRateLimitExceededCard = true;

              break;

            default:
              console.log('checkNewEmailVerificationCode | Unknown message: ' + msg);
              break;
          }
        },
        (error) => {
          console.log(error);
          this.showNewEmailVerificationCodeIncorrectCard = true;
        }
      );
  }

  private changeEmail() {
    const body = {
      'oldEmailCode': this.oldEmailVerificationCode,
      'newEmailCode': this.newEmailVerificationCode,
      'newEmailAddress': this.newEmailAddress
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changeEmail/changeEmailAddress', body, 'changeEmail').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        const msg = data.msg;

        if (msg === 'email_changed') {
          this._myUserService.setEmail(this.newEmailAddress);
          console.log('changeEmail | Email address changed successfully!');
          this.nextStep();
        } else {
          console.log('changeEmail | Email not changed! Message: ' + msg);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
