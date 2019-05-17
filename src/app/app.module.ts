import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';

import {CustomFormsModule} from 'ng2-validation';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MaterialModule} from './material-module';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ClipboardModule} from 'ngx-clipboard';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {AppRoutingModule} from './app-routing.module';


import {TranslatePipe} from './translation/translate.pipe';
import {NoSanitizePipe} from './no-sanitize.pipe';


import {CookieService} from 'angular2-cookie/core';

import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth-guard.service';
import {TranslateService} from './translation/translate.service';
import {HttpService} from './services/http.service';
import {ExcelService} from './services/excel.service';
import {SessionsService} from './home/settings/sessions/sessions.service';


import {MAT_DATE_LOCALE, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material';

import {AppComponent} from './app.component';
import {SigninComponent} from './auth/signin/signin.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './footer/footer.component';
import {InfoComponent} from './info/info.component';
import {ImprintComponent} from './info/imprint/imprint.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {StartComponent} from './home/start/start.component';
import {SettingsComponent} from './home/settings/settings.component';
import {FeedbackModalComponent} from './footer/modals/feedback-modal/feedback-modal.component';
import {AboutModalComponent} from './footer/modals/about-modal/about-modal.component';
import {PersonalDataComponent} from './home/settings/personal-data/personal-data.component';
import {PhoneNumberComponent} from './home/settings/phone-number/phone-number.component';
import {EmailAddressComponent} from './home/settings/email-address/email-address.component';
import {PasswordComponent} from './home/settings/password/password.component';
import {TwoFactorAuthenticationComponent} from './home/settings/two-factor-authentication/two-factor-authentication.component';
import {MovieTicketsComponent} from './home/cinema/movie-tickets/movie-tickets.component';
import {MovieServiceComponent} from './home/cinema/movie-service/movie-service.component';
import {MovieAdministrationComponent} from './home/cinema/movie-administration/movie-administration.component';
import {MovieTicketComponent} from './home/cinema/movie-tickets/movie-ticket/movie-ticket.component';
import {MovieEditModalComponent} from './home/cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {MovieBookTicketsModalComponent} from './home/cinema/movie-tickets/movie-ticket/movie-book-tickets-modal/movie-book-tickets-modal.component';
import {MovieCreateModalComponent} from './home/cinema/movie-administration/movie-create-modal/movie-create-modal.component';
import {UsersExportBottomSheetComponent, UsersManagementComponent} from './home/management/users-management/users-management.component';
import {DoNotForgetToSaveComponent} from './home/do-not-forget-to-save/do-not-forget-to-save.component';
import {DatepollManagementComponent} from './home/management/datepoll-management/datepoll-management.component';
import {UserCreateModalComponent} from './home/management/users-management/user-create-modal/user-create-modal.component';
import {UserUpdateModalComponent} from './home/management/users-management/user-update-modal/user-update-modal.component';
import {GroupsManagementComponent} from './home/management/groups-management/groups-management.component';
import {GroupCreateModalComponent} from './home/management/groups-management/group-create-modal/group-create-modal.component';
import {GroupUpdateModalComponent} from './home/management/groups-management/group-update-modal/group-update-modal.component';
import {SubgroupUpdateModalComponent} from './home/management/groups-management/subgroup-update-modal/subgroup-update-modal.component';
import {SubgroupCreateModalComponent} from './home/management/groups-management/subgroup-create-modal/subgroup-create-modal.component';
import {CalendarTokenComponent} from './home/settings/calendar-token/calendar-token.component';
import {GroupUserListModalComponent} from './home/management/groups-management/group-user-list-modal/group-user-list-modal.component';
import {SubgroupUserListModalComponent} from './home/management/groups-management/subgroup-user-list-modal/subgroup-user-list-modal.component';
import {GroupUserRoleUpdateModalComponent} from './home/management/groups-management/group-user-list-modal/group-user-role-update-modal/group-user-role-update-modal.component';
import {SubgroupUserRoleUpdateModalComponent} from './home/management/groups-management/subgroup-user-list-modal/subgroup-user-role-update-modal/subgroup-user-role-update-modal.component';
import {CalendarComponent} from './home/calendar/calendar.component';
import {SessionsComponent} from './home/settings/sessions/sessions.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {PerformanceBadgesManagmentComponent} from './home/management/performance-badges-management/performance-badges-managment.component';
import { PerformanceBadgeUpdateModalComponent } from './home/management/performance-badges-management/performance-badge-update-modal/performance-badge-update-modal.component';
import { InstrumentUpdateModalComponent } from './home/management/performance-badges-management/instrument-update-modal/instrument-update-modal.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe,
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
    PasswordComponent,
    TwoFactorAuthenticationComponent,
    DoNotForgetToSaveComponent,
    MovieTicketsComponent,
    MovieServiceComponent,
    MovieAdministrationComponent,
    MovieTicketComponent,
    MovieEditModalComponent,
    MovieBookTicketsModalComponent,
    MovieCreateModalComponent,
    UsersManagementComponent,
    UsersExportBottomSheetComponent,
    DatepollManagementComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent,
    GroupsManagementComponent,
    GroupCreateModalComponent,
    GroupUpdateModalComponent,
    SubgroupUpdateModalComponent,
    SubgroupCreateModalComponent,
    CalendarTokenComponent,
    GroupUserListModalComponent,
    SubgroupUserListModalComponent,
    GroupUserRoleUpdateModalComponent,
    SubgroupUserRoleUpdateModalComponent,
    CalendarComponent,
    NoSanitizePipe,
    SessionsComponent,
    ForgotPasswordComponent,
    PerformanceBadgesManagmentComponent,
    PerformanceBadgeUpdateModalComponent,
    InstrumentUpdateModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    HttpClientModule,
    NgxChartsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    ClipboardModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot({
      position: ['top', 'right'],
      timeOut: 5000
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  // Without this entryComponents dynamic modal loading does not work
  entryComponents: [
    FeedbackModalComponent,
    AboutModalComponent,
    PersonalDataComponent,
    PhoneNumberComponent,
    EmailAddressComponent,
    PasswordComponent,
    CalendarTokenComponent,
    SessionsComponent,
    //   TwoFactorAuthenticationComponent,
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieBookTicketsModalComponent,
    UsersExportBottomSheetComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent,
    GroupCreateModalComponent,
    GroupUpdateModalComponent,
    SubgroupUpdateModalComponent,
    SubgroupCreateModalComponent,
    GroupUserListModalComponent,
    SubgroupUserListModalComponent,
    GroupUserRoleUpdateModalComponent,
    SubgroupUserRoleUpdateModalComponent,
    PerformanceBadgeUpdateModalComponent,
    InstrumentUpdateModalComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    TranslateService,
    HttpService,
    ExcelService,
    SessionsService,
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
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
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
