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

import {TranslateService} from './translation/translate.service';

import {AuthInterceptor} from './auth/auth-interceptor';

import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';

import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {BrowserCompatibilityModalComponent} from './browser-compatibility-modal/browser-compatibility-modal.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {NoSanitizeModule} from './utils/shared-components/no-sanitize/noSanitize.module';

registerLocaleData(localeDe);

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, BrowserCompatibilityModalComponent],
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
    NoSanitizeModule,
  ],
  providers: [
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
  bootstrap: [AppComponent],
})
export class AppModule {}

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('DEFAULT');
}
