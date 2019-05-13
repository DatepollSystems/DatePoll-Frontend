import {Component} from '@angular/core';

import {PersonalDataComponent} from './personal-data/personal-data.component';
import {PhoneNumberComponent} from './phone-number/phone-number.component';
import {EmailAddressComponent} from './email-address/email-address.component';
import {PasswordComponent} from './password/password.component';
import {MatDialog} from '@angular/material';
import {CalendarTokenComponent} from './calendar-token/calendar-token.component';
import {SessionsComponent} from './sessions/sessions.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private dialog: MatDialog) {
  }

  openPersonalDataModal() {
    this.dialog.open(PersonalDataComponent, {
      width: '80vh',
    });
  }

  openPhoneNumberModal() {
    this.dialog.open(PhoneNumberComponent, {
      width: '80vh',
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

  onSessionManagmentModal() {
    this.dialog.open(SessionsComponent, {
      width: '80vh'
    });
  }

  openTwoFactorAuthenticationModal() {
    // this.modalService.open(TwoFactorAuthenticationComponent);
  }

}
