import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {SigninComponent} from './auth/signin/signin.component';
import {InfoComponent} from './info/info.component';
import {ImprintComponent} from './info/imprint/imprint.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {StartComponent} from './home/start/start.component';
import {SettingsComponent} from './home/settings/settings.component';
import {MovieTicketsComponent} from './home/cinema/movie-tickets/movie-tickets.component';
import {MovieServiceComponent} from './home/cinema/movie-service/movie-service.component';
import {MovieAdministrationComponent} from './home/cinema/movie-administration/movie-administration.component';
import {UsersManagementComponent} from './home/management/users-management/users-management.component';
import {DatepollManagementComponent} from './home/management/datepoll-management/datepoll-management.component';
import {GroupsManagementComponent} from './home/management/groups-management/groups-management.component';
import {CalendarComponent} from './home/calendar/calendar.component';
import {AuthGuard} from './auth/auth-guard.service';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {PerformanceBadgesManagmentComponent} from './home/management/performance-badges-management/performance-badges-managment.component';

const appRoutes = [
  {path: '', redirectTo: '/signin', pathMatch: 'full'},
  {
    path: 'info', component: InfoComponent, children: [
      {path: 'imprint', component: ImprintComponent},
      {path: 'privacypolicy', component: PrivacyPolicyComponent}
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      {path: '', pathMatch: 'full', component: StartComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'cinema/tickets', component: MovieTicketsComponent},
      {path: 'cinema/service', component: MovieServiceComponent},
      {path: 'cinema/administration', component: MovieAdministrationComponent},
      {path: 'settings/personal', component: SettingsComponent},
      {path: 'management/user', component: UsersManagementComponent},
      {path: 'management/group', component: GroupsManagementComponent},
      {path: 'management/performanceBadges', component: PerformanceBadgesManagmentComponent},
      {path: 'management/datepoll', component: DatepollManagementComponent}
    ]
  },
  {path: 'signin', component: SigninComponent},
  {path: 'forgotPassword', component: ForgotPasswordComponent},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
