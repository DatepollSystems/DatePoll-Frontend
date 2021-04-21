import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';

import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material-module';
import {TranslationModule} from './translation/translation.module';

import {NoSanitizePipe} from './no-sanitize.pipe';

import {AuthGuard} from './auth/auth-guard.service';
import {AuthService} from './auth/auth.service';
import {TranslateService} from './translation/translate.service';
import {HttpService} from './utils/http.service';
import {IsMobileService} from './utils/is-mobile.service';
import {SettingsService} from './utils/settings.service';
import {IsAuthenticatedGuardService} from './auth/is-authenticated-guard.service';

import {AuthInterceptor} from './auth/auth-interceptor';

import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';

import {environment} from '../environments/environment';

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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    IsAuthenticatedGuardService,
    TranslateService,
    HttpService,
    IsMobileService,
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // Set the datetimepicker time format to day/month/year
    {provide: MAT_DATE_LOCALE, useValue: 'de-AT'},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
  ],
  exports: [NoSanitizePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('DEFAULT');
}
