import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {InfoComponent} from './info/info.component';
import {ImprintComponent} from './info/imprint/imprint.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {StartComponent} from './home/start/start.component';
import {SettingsComponent} from './home/settings/settings.component';

const appRoutes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'info', component: InfoComponent, children: [
      { path: 'imprint', component: ImprintComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent }
    ] },
  { path: 'home', component: HomeComponent, children: [
      { path: '', pathMath: 'full', component: StartComponent },
      { path: 'settings', component: SettingsComponent}
    ] },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
