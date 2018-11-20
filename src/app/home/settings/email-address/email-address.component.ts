import {Component, ViewChild} from '@angular/core';
import {MyUserService} from '../../../auth/my-user.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent {
  @ViewChild('stepper') stepper;

  oldEmailAddress: string;
  oldEmailVerificationCode: number;

  newEmailAddress: string;
  newEmailVerificationCode: number;

  constructor(private _myUserService: MyUserService, private _snackBar: MatSnackBar,) {
  }

  nextStep() {
    this.stepper.selectedIndex++;
  }

  sendOldEmailVerification() {
    // Incorrect test
    if (this.oldEmailAddress !== this._myUserService.getEmail()) {
      this._snackBar.openFromComponent(EmailAddressNotCorrectComponent, {
        duration: 4000
      });

      console.log('Email-Address is incorrect! Email: ' + this.oldEmailAddress);
      return;
    }

    console.log('Email-Address is correct!');
    this.nextStep();
  }

  checkOldEmailVerificationCode() {
    // Invalid test
    if (this.oldEmailVerificationCode === 666666) {
      this._snackBar.openFromComponent(VerificationCodeNotCorrectComponent, {
        duration: 4000
      });

      console.log('Validation code is incorrect! Code: ' + this.oldEmailVerificationCode);
      return;
    }

    console.log('Validation code is correct!');
    this.nextStep();
  }

  sendNewEmailVerification() {
    if (this.newEmailAddress === this.oldEmailAddress) {
      this._snackBar.openFromComponent(NewEmailIsOldEmailComponent, {
        duration: 4000
      });

      console.log('User Error: Old email address is new email address!');
      return;
    }

    console.log('Email sent');
    this.nextStep();
  }

  checkNewEmailVerificationCode() {
    // Invalid test
    if (this.newEmailVerificationCode === 666666) {
      this._snackBar.openFromComponent(VerificationCodeNotCorrectComponent, {
        duration: 4000
      });

      console.log('Validation code is incorrect! Code: ' + this.newEmailVerificationCode);
      return;
    }
    console.log('Validation code is correct!');

    this._myUserService.setEmail(this.newEmailAddress);
    console.log('Email address changed successfully!');

    this.nextStep();
  }
}

@Component({
  selector: 'app-email-address-email-address-enter-incorrect',
  template: '<div class="test">{{"SETTINGS_PERSONAL_DATA_MODAL_EMAIL_ADDRESS_ENTER_OLD_EMAiL_ADDRESS_INCORRECT" | translate}}</div>',
  styles: [`
    .test {
      color: #FF7043;
    }
  `],
})
export class EmailAddressNotCorrectComponent {
}

@Component({
  selector: 'app-email-address-verification-code-enter-incorrect',
  template: '<div class="test">{{"SETTINGS_PERSONAL_DATA_MODAL_EMAIL_ADDRESS_ENTER_VERIFICATION_CODE_INCORRECT" | translate}}</div>',
  styles: [`
    .test {
      color: #FF7043;
    }
  `],
})
export class VerificationCodeNotCorrectComponent {
}

@Component({
  selector: 'app-email-address-no-change',
  template: '<div class="test">{{"SETTINGS_PERSONAL_DATA_MODAL_EMAIL_ADDRESS_NEW_EMAIL_IS_OLD_EMAIL" | translate}}</div>',
  styles: [`
    .test {
      color: #FF7043;
    }
  `],
})
export class NewEmailIsOldEmailComponent {
}
