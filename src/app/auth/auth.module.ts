import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';
import {CommonComponentsModule} from '../home/common-components.module';
import {FooterModule} from '../footer/footer.module';
import {AuthRoutingModule} from './auth-routing.module';

import {SigninComponent} from './signin/signin.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    SigninComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    FooterModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
