import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../material-module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {TranslationModule} from '../../translation/translation.module';
import {SettingsRoutingModule} from './settings-routing.module';

import {SessionsService} from './sessions/sessions.service';

import {CalendarTokenComponent} from './calendar-token/calendar-token.component';
import {EmailAddressComponent} from './email-address/email-address.component';
import {PasswordComponent} from './password/password.component';
import {PersonalDataComponent} from './personal-data/personal-data.component';
import {PhoneNumberComponent} from './phone-number/phone-number.component';
import {PrivacySettingsComponent} from './privacy-settings/privacy-settings.component';
import {SessionsComponent} from './sessions/sessions.component';
import {SettingsComponent} from './settings.component';
import {TwoFactorAuthenticationComponent} from './two-factor-authentication/two-factor-authentication.component';

@NgModule({
  declarations: [
    SettingsComponent,
    PersonalDataComponent,
    PhoneNumberComponent,
    EmailAddressComponent,
    PasswordComponent,
    CalendarTokenComponent,
    TwoFactorAuthenticationComponent,
    SessionsComponent,
    PrivacySettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    SettingsRoutingModule
  ],
  providers: [SessionsService],
  exports: [SettingsComponent]
})
export class SettingsModule {}
