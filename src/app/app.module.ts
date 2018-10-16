import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {FormsModule} from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {DataStorageService} from './data-storage.service';
import {FooterComponent} from './footer/footer.component';
import {InfoComponent} from './info/info.component';
import {ImprintComponent} from './info/imprint/imprint.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {MaterializeComponentModule} from './materialize.module';
import {OuterFooterComponent} from './footer/outer-footer/outer-footer.component';
import {InnerFooterComponent} from './footer/inner-footer/inner-footer.component';
import {UserService} from './auth/user.service';
import {StartComponent} from './home/start/start.component';
import {SettingsComponent} from './home/settings/settings.component';
import {TranslateService} from './translate.service';
import {HttpClientModule} from '@angular/common/http';
import {TranslatePipe} from './translate.pipe';
import {CookieService} from 'angular2-cookie/core';
import {FeedbackModalComponent} from './footer/modals/feedback-modal/feedback-modal.component';
import {AboutModalComponent} from './footer/modals/about-modal/about-modal.component';
import {MzModalService} from 'ngx-materialize';
import {PersonalDataComponent} from './home/settings/personal-data/personal-data.component';

export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('DEFAULT');
}

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    PageNotFoundComponent,
    HomeComponent,
    FooterComponent,
    InfoComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    OuterFooterComponent,
    InnerFooterComponent,
    StartComponent,
    SettingsComponent,
    TranslatePipe,
    FeedbackModalComponent,
    AboutModalComponent,
    PersonalDataComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterializeComponentModule.forRoot()
  ],
  entryComponents: [
    FeedbackModalComponent,
    AboutModalComponent,
    PersonalDataComponent
  ],
  providers: [
    AuthService,
    DataStorageService,
    UserService,
    {provide: CookieService, useFactory: cookieServiceFactory},
    TranslateService,
    MzModalService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function cookieServiceFactory() {
  return new CookieService();
}
