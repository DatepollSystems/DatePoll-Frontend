import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {QRCodeModule} from 'angularx-qrcode';
import {FooterModule} from '../footer/footer.module';
import {MaterialModule} from '../material-module';
import {CommonComponentsModule} from '../services/common-components.module';
import {TranslationModule} from '../translation/translation.module';
import {AuthRoutingModule} from './auth-routing.module';

import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {SigninComponent} from './signin/signin.component';

@NgModule({
  declarations: [SigninComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    FooterModule,
    QRCodeModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
