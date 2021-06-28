import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {CommonComponentsModule} from '../../utils/common-components.module';
import {SettingsRoutingModule} from './settings-routing.module';

import {CalendarTokenComponent} from './calendar-token/calendar-token.component';
import {EmailAddressComponent} from './email-address/email-address.component';
import {PasswordComponent} from './password/password.component';
import {PersonalDataComponent} from './personal-data/personal-data.component';
import {PhoneNumberComponent} from './phone-number/phone-number.component';
import {PrivacySettingsComponent} from './privacy-settings/privacy-settings.component';
import {SessionsComponent} from './sessions/sessions.component';
import {SettingsComponent} from './settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    PersonalDataComponent,
    PhoneNumberComponent,
    EmailAddressComponent,
    PasswordComponent,
    CalendarTokenComponent,
    SessionsComponent,
    PrivacySettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DfxTranslateModule,
    CommonComponentsModule,
    SettingsRoutingModule,
  ],
  exports: [SettingsComponent],
})
export class SettingsModule {}
