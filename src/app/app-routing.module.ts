import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {StartComponent} from './home/start/start.component';
import {AuthGuard} from './auth/auth-guard.service';

const appRoutes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      {path: '', pathMatch: 'full', component: StartComponent},
      {path: 'cinema', loadChildren: './home/cinema/cinema.module#CinemaModule'},
      {path: 'calendar', loadChildren: './home/calendar/calendar-component.module#CalendarComponentModule'},
      {path: 'settings/personal', loadChildren: './home/settings/settings.module#SettingsModule'},
      {path: 'management/user', loadChildren: './home/management/users-management/users-management.module#UsersManagementModule'},
      {path: 'management/group', loadChildren: './home/management/groups-management/groups-management.module#GroupsManagementModule'},
      {path: 'management/performanceBadges',
        loadChildren:
          './home/management/performance-badges-management/performance-badges-management.module#PerformanceBadgesManagementModule'},
      {path: 'management/datepoll',
        loadChildren: './home/management/datepoll-management/datepoll-management.module#DatepollManagementModule'}
    ]
  },
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
