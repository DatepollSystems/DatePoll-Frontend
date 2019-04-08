import {Component, OnInit} from '@angular/core';
import {PersonalDataComponent} from './personal-data/personal-data.component';
import {PhoneNumberComponent} from './phone-number/phone-number.component';
import {EmailAddressComponent} from './email-address/email-address.component';
import {PasswordComponent} from './password/password.component';
import {TwoFactorAuthenticationComponent} from './two-factor-authentication/two-factor-authentication.component';
import {MatDialog} from '@angular/material';
import {FeedbackModalComponent} from '../../footer/modals/feedback-modal/feedback-modal.component';
import {CalendarTokenComponent} from './calendar-token/calendar-token.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openPersonalDataModal() {
    this.dialog.open(PersonalDataComponent, {
      width: '50vh',
    });
  }

  openPhoneNumberModal() {
    this.dialog.open(PhoneNumberComponent, {
      width: '70vh',
    });
  }

  openEmailAddressModal() {
    this.dialog.open(EmailAddressComponent, {
      width: '80vh',
    });
  }

  openPasswordModal() {
    this.dialog.open(PasswordComponent, {
      width: '80vh',
    });
  }

  openCalendarTokenModal() {
    this.dialog.open(CalendarTokenComponent, {
      width: '80vh',
    });
  }

  openTwoFactorAuthenticationModal() {
    // this.modalService.open(TwoFactorAuthenticationComponent);
  }

}
