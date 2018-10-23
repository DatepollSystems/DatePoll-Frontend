import { Component } from '@angular/core';
import {MzBaseModal} from 'ngx-materialize';
import {MyUserService} from '../../../auth/my-user.service';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent extends MzBaseModal {

  oldEmailValidation = false;
  codeValidation = true;
  newEmailEnter = true;
  newEmailCodeValidation = true;
  finished = true;

  oldEmailAddress: string;
  oldEmailAddressIncorrect = false;

  verificationCode: number;
  verificationCodeIncorrect = false;

  newEmail: string;

  newVerificationCode: number;
  newVerificationCodeIncorrect = false;

  constructor(private myUserService: MyUserService) {
    super();
  }

  sendOldEmailVerification() {
    // Incorrect test
    if (this.oldEmailAddress !== this.myUserService.getEmail()) {
      this.oldEmailAddressIncorrect = true;

      console.log('Email Adress is incorrect! Email: ' + this.oldEmailAddress);

      return;
    }

    this.oldEmailAddressIncorrect = false;

    // Hide
    this.oldEmailValidation = true;
    // Show
    this.codeValidation = false;

    console.log('Email Adress is correct!');
  }

  checkCode() {
    // Invalid test
    if (this.verificationCode === 666666) {
      this.verificationCodeIncorrect = true;

      console.log('Validation code is incorrect! Code: ' + this.verificationCode);

      return;
    }

    this.verificationCodeIncorrect = false;

    // Hide
    this.codeValidation = true;
    // Show
    this.newEmailEnter = false;

    console.log('Validation code is correct!');
  }

  sendNewEmailVerification() {
    // Hide
    this.newEmailEnter = true;
    // Show
    this.newEmailCodeValidation = false;
  }

  checkNewCode() {
    // Invalid test
    if (this.newVerificationCode === 666666) {
      this.newVerificationCodeIncorrect = true;

      console.log('Validation code is incorrect! Code: ' + this.newVerificationCode);

      return;
    }

    this.newVerificationCodeIncorrect = false;

    // Hide
    this.newEmailCodeValidation = true;
    // Show
    this.finished = false;

    console.log('Validation code is correct!');

    this.myUserService.setEmail(this.newEmail);
    console.log('Email address changed successfully!');
  }

}
