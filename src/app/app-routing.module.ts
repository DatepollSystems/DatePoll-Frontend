import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {StartComponent} from './home/start/start.component';
import {AuthGuard} from './auth/auth-guard.service';

const appRoutes = [
  {path: '', redirectTo: '/auth/signin', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', component: StartComponent},
      {path: 'cinema', loadChildren: () => import('./home/cinema/cinema.module').then(m => m.CinemaModule)},
      {path: 'events', loadChildren: () => import('./home/events/events.module').then(m => m.EventsModule)},
      {path: 'calendar', loadChildren: () => import('./home/calendar/calendar-component.module').then(m => m.CalendarComponentModule)},
      {path: 'settings', loadChildren: () => import('./home/settings/settings.module').then(m => m.SettingsModule)},
      {
        path: 'management/user',
        loadChildren: () => import('./home/management/users-management/users-management.module').then(m => m.UsersManagementModule)
      },
      {
        path: 'management/group',
        loadChildren: () => import('./home/management/groups-management/groups-management.module').then(m => m.GroupsManagementModule)
      },
      {
        path: 'management/performanceBadges',
        loadChildren: () =>
          import('./home/management/performance-badges-management/performance-badges-management.module').then(
            m => m.PerformanceBadgesManagementModule
          )
      },
      {
        path: 'management/datepoll',
        loadChildren: () => import('./home/management/datepoll-management/datepoll-management.module').then(m => m.DatepollManagementModule)
      }
    ]
  },
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
