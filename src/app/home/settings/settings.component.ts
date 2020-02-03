import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

import {CalendarTokenComponent} from './calendar-token/calendar-token.component';
import {EmailAddressComponent} from './email-address/email-address.component';
import {PasswordComponent} from './password/password.component';
import {PersonalDataComponent} from './personal-data/personal-data.component';
import {PhoneNumberComponent} from './phone-number/phone-number.component';
import {PrivacySettingsComponent} from './privacy-settings/privacy-settings.component';
import {SessionsComponent} from './sessions/sessions.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(private dialog: MatDialog, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const modalParam = params.get('modal');

      if (modalParam != null) {
        console.log('Model to open: ' + modalParam);

        switch (modalParam) {
          case 'privacySettings':
            this.onPrivacySettingsModal();
            break;
          case 'emailSettings':
            this.openEmailAddressModal();
            break;
          default:
            console.log('Unknown modalParam');
            break;
        }
      } else {
        console.log('No modal to open');
      }
    });
  }

  openPersonalDataModal() {
    this.dialog.open(PersonalDataComponent, {
      width: '80vh'
    });
  }

  openPhoneNumberModal() {
    this.dialog.open(PhoneNumberComponent, {
      width: '80vh'
    });
  }

  openEmailAddressModal() {
    this.dialog.open(EmailAddressComponent, {
      width: '80vh'
    });
  }

  openPasswordModal() {
    this.dialog.open(PasswordComponent, {
      width: '80vh'
    });
  }

  openCalendarTokenModal() {
    this.dialog.open(CalendarTokenComponent, {
      width: '80vh'
    });
  }

  onSessionManagementModal() {
    this.dialog.open(SessionsComponent, {
      width: '80vh'
    });
  }

  onPrivacySettingsModal() {
    this.dialog.open(PrivacySettingsComponent, {
      width: '80vh'
    });
  }

  openTwoFactorAuthenticationModal() {
    // this.modalService.open(TwoFactorAuthenticationComponent);
  }
}
