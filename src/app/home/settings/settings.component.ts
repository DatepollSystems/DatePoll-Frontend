import { Component, OnInit } from '@angular/core';
import {MzModalService} from 'ngx-materialize';
import {PersonalDataComponent} from './personal-data/personal-data.component';
import {PhoneNumberComponent} from './phone-number/phone-number.component';
import {EmailAddressComponent} from './email-address/email-address.component';
import {PasswordComponent} from './password/password.component';
import {TwoFactorAuthenticationComponent} from './two-factor-authentication/two-factor-authentication.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private modalService: MzModalService) { }

  ngOnInit() { }

  openPersonalDataModal() {
    this.modalService.open(PersonalDataComponent);
  }

  openPhoneNumberModal() {
    this.modalService.open(PhoneNumberComponent);
  }

  openEmailAddressModal() {
    this.modalService.open(EmailAddressComponent);
  }

  openPasswordModal() {
    this.modalService.open(PasswordComponent);
  }

  openTwoFactorAuthenticationModal() {
    this.modalService.open(TwoFactorAuthenticationComponent);
  }

}
