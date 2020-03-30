import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {SimpleNotificationsModule} from 'angular2-notifications';

import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material-module';
import {TranslationModule} from './translation/translation.module';

import {NoSanitizePipe} from './no-sanitize.pipe';

import {AuthGuard} from './auth/auth-guard.service';
import {AuthService} from './auth/auth.service';
import {HttpService} from './services/http.service';
import {IsMobileService} from './services/is-mobile.service';
import {TranslateService} from './translation/translate.service';

import {AuthInterceptor} from './auth/auth-interceptor';

import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';

import {AppComponent} from './app.component';
import {BrowserCompatibilityModalComponent} from './browser-compatibility-modal/browser-compatibility-modal.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, NoSanitizePipe, BrowserCompatibilityModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    TranslationModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot({
      timeOut: 2000
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    TranslateService,
    HttpService,
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
