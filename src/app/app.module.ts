import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {InputTextModule, MenuModule, PasswordModule, ToolbarModule} from 'primeng/primeng';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {FormsModule} from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {DataStorageService} from './data-storage.service';
import {FooterComponent} from './footer/footer.component';
import { InfoComponent } from './info/info.component';
import { ImprintComponent } from './info/imprint/imprint.component';
import { PrivacyPolicyComponent } from './info/privacy-policy/privacy-policy.component';

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
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToolbarModule,
    MenuModule
  ],
  providers: [AuthService, DataStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
