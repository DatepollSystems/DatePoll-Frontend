import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';

import {MaterialModule} from './material-module';
import {SimpleNotificationsModule} from 'angular2-notifications';

import {AppRoutingModule} from './app-routing.module';

import {TranslationModule} from './translation/translation.module';
import {FooterModule} from './footer/footer.module';
import {CommonEventsComponentsModule} from './home/events/common-events-components.module';

import {CookieService} from 'angular2-cookie/core';

import {NoSanitizePipe} from './no-sanitize.pipe';

import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth-guard.service';
import {TranslateService} from './translation/translate.service';
import {HttpService} from './services/http.service';
import {ExcelService} from './services/excel.service';
import {SessionsService} from './home/settings/sessions/sessions.service';
import {UsersService} from './home/management/users-management/users.service';
import {GroupsService} from './home/management/groups-management/groups.service';
import {PerformanceBadgesService} from './home/management/performance-badges-management/performance-badges.service';
import {CinemaService} from './home/cinema/cinema.service';
import {EventsService} from './home/events/events.service';
import {EventsUserService} from './home/events/events-user.service';
import {HomepageService} from './home/start/homepage.service';

import {AuthInterceptor} from './auth/auth-interceptor';

import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';

import {AppComponent} from './app.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {StartComponent} from './home/start/start.component';
import {TableBookingsRowComponent} from './home/start/table-bookings-row/table-bookings-row.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    StartComponent,
    NoSanitizePipe,
    TableBookingsRowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    TranslationModule,
    FooterModule,
    CommonEventsComponentsModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot({
      // position: ['top', 'right'],
      timeOut: 5000
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    TranslateService,
    HttpService,
    ExcelService,
    SessionsService,
    UsersService,
    GroupsService,
    PerformanceBadgesService,
    CinemaService,
    EventsService,
    EventsUserService,
    HomepageService,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // Set the datetimepicker time format to day/month/year
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
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
