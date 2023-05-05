import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {QRCodeModule} from 'angularx-qrcode';
import {FooterModule} from '../footer/footer.module';
import {MaterialModule} from '../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {AuthRoutingModule} from './auth-routing.module';

import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {SigninComponent} from './signin/signin.component';
import {MobileAppBottomSheetComponent} from './signin/mobile-app-bottom-sheet/mobile-app-bottom-sheet.component';

@NgModule({
  declarations: [SigninComponent, ForgotPasswordComponent, MobileAppBottomSheetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DfxTranslateModule,
    FooterModule,
    QRCodeModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
