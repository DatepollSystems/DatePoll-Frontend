import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {SimpleNotificationsModule} from 'angular2-notifications';
import {MaterialModule} from './material-module';

import {AppRoutingModule} from './app-routing.module';

import {FooterModule} from './footer/footer.module';
import {CommonEventsComponentsModule} from './home/events/common-events-components.module';
import {TranslationModule} from './translation/translation.module';

import {CookieService} from 'ngx-cookie-service';

import {NoSanitizePipe} from './no-sanitize.pipe';

import {AuthGuard} from './auth/auth-guard.service';
import {AuthService} from './auth/auth.service';
import {CinemaService} from './home/cinema/cinema.service';
import {EventsUserService} from './home/events/events-user.service';
import {EventsService} from './home/events/events.service';
import {GroupsService} from './home/management/groups-management/groups.service';
import {PerformanceBadgesService} from './home/management/performance-badges-management/performance-badges.service';
import {UsersService} from './home/management/users-management/users.service';
import {SessionsService} from './home/settings/sessions/sessions.service';
import {HomepageService} from './home/start/homepage.service';
import {ExcelService} from './services/excel.service';
import {HttpService} from './services/http.service';
import {IsMobileService} from './services/is-mobile.service';
import {TranslateService} from './translation/translate.service';

import {AuthInterceptor} from './auth/auth-interceptor';

import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';

import {AppComponent} from './app.component';
import {BrowserCompatibilityModalComponent} from './browser-compatibility-modal/browser-compatibility-modal.component';
import {HomeComponent} from './home/home.component';
import {StartComponent} from './home/start/start.component';
import {TableBookingsRowComponent} from './home/start/table-bookings-row/table-bookings-row.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    StartComponent,
    NoSanitizePipe,
    TableBookingsRowComponent,
    BrowserCompatibilityModalComponent
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
    })
  ],
  entryComponents: [BrowserCompatibilityModalComponent],
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
    CookieService,
    IsMobileService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // Set the datetimepicker time format to day/month/year
    {provide: MAT_DATE_LOCALE, useValue: 'de-AT'},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('DEFAULT');
}
