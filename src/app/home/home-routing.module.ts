import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: '', pathMatch: 'full', loadChildren: () => import('./start/start.module').then(m => m.StartModule), data: {preload: true}},
      {path: 'cinema', loadChildren: () => import('./cinema/cinema.module').then(m => m.CinemaModule), data: {preload: true}},
      {path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule)},
      {path: 'calendar', loadChildren: () => import('./calendar/calendar-component.module').then(m => m.CalendarComponentModule)},
      {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), data: {preload: true}},
      {
        path: 'management/user',
        loadChildren: () => import('./management/users-management/users-management.module').then(m => m.UsersManagementModule)
      },
      {
        path: 'management/group',
        loadChildren: () => import('./management/groups-management/groups-management.module').then(m => m.GroupsManagementModule)
      },
      {
        path: 'management/performanceBadges',
        loadChildren: () =>
          import('./management/performance-badges-management/performance-badges-management.module').then(
            m => m.PerformanceBadgesManagementModule
          )
      },
      {
        path: 'management/datepoll',
        loadChildren: () => import('./management/datepoll-management/datepoll-management.module').then(m => m.DatepollManagementModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
