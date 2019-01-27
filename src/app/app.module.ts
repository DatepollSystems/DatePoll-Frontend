import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {DataStorageService} from './data-storage.service';
import {FooterComponent} from './footer/footer.component';
import {InfoComponent} from './info/info.component';
import {ImprintComponent} from './info/imprint/imprint.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {MyUserService} from './auth/my-user.service';
import {StartComponent} from './home/start/start.component';
import {SettingsComponent} from './home/settings/settings.component';
import {TranslateService} from './translation/translate.service';
import {HttpClientModule} from '@angular/common/http';
import {TranslatePipe} from './translation/translate.pipe';
import {CookieService} from 'angular2-cookie/core';
import {FeedbackModalComponent} from './footer/modals/feedback-modal/feedback-modal.component';
import {AboutModalComponent} from './footer/modals/about-modal/about-modal.component';
import {PersonalDataComponent} from './home/settings/personal-data/personal-data.component';
import {PhoneNumberComponent} from './home/settings/phone-number/phone-number.component';
import {
  EmailAddressComponent,
  EmailAddressNotCorrectComponent, NewEmailIsOldEmailComponent,
  VerificationCodeNotCorrectComponent
} from './home/settings/email-address/email-address.component';
import {PasswordComponent} from './home/settings/password/password.component';
import {TwoFactorAuthenticationComponent} from './home/settings/two-factor-authentication/two-factor-authentication.component';
import {CustomFormsModule} from 'ng2-validation';
import {DoNotForgetToSaveComponent} from './do-not-forget-to-save/do-not-forget-to-save.component';
import {MovieTicketsComponent} from './home/cinema/movie-tickets/movie-tickets.component';
import {MovieServiceComponent} from './home/cinema/movie-service/movie-service.component';
import {MovieAdministrationComponent} from './home/cinema/movie-administration/movie-administration.component';
import {MovieTicketComponent} from './home/cinema/movie-tickets/movie-ticket/movie-ticket.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MovieEditModalComponent} from './home/cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {MaterialModule} from './material-module';
import {MAT_DATE_LOCALE} from '@angular/material';
import {
  MovieBookTicketsModalComponent
} from './home/cinema/movie-tickets/movie-ticket/movie-book-tickets-modal/movie-book-tickets-modal.component';
import {HttpModule} from '@angular/http';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe,
    SignupComponent,
    SigninComponent,
    PageNotFoundComponent,
    FooterComponent,
    FeedbackModalComponent,
    AboutModalComponent,
    InfoComponent,
    ImprintComponent,
    HomeComponent,
    StartComponent,
    SettingsComponent,
    PrivacyPolicyComponent,
    PersonalDataComponent,
    PhoneNumberComponent,
    EmailAddressComponent,
    EmailAddressNotCorrectComponent,
    VerificationCodeNotCorrectComponent,
    NewEmailIsOldEmailComponent,
    PasswordComponent,
    TwoFactorAuthenticationComponent,
    DoNotForgetToSaveComponent,
    MovieTicketsComponent,
    MovieServiceComponent,
    MovieAdministrationComponent,
    MovieTicketComponent,
    MovieEditModalComponent,
    MovieBookTicketsModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    NgxChartsModule,
    MaterialModule,
    NgxMatSelectSearchModule
  ],
  // Without this entryComponents dynamic modal loading does not work
  entryComponents: [
    FeedbackModalComponent,
    AboutModalComponent,
    PersonalDataComponent,
    PhoneNumberComponent,
    EmailAddressComponent,
    EmailAddressNotCorrectComponent,
    VerificationCodeNotCorrectComponent,
    NewEmailIsOldEmailComponent,

    //   PasswordComponent,
    //   TwoFactorAuthenticationComponent,
    MovieEditModalComponent,
    MovieBookTicketsModalComponent
  ],
  providers: [
    AuthService,
    DataStorageService,
    MyUserService,
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    },
    {
      provide: CookieService,
      useFactory: cookieServiceFactory
    },
    // Set the datetimepicker time format to day/month/year
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('DEFAULT');
}

export function cookieServiceFactory() {
  return new CookieService();
}
