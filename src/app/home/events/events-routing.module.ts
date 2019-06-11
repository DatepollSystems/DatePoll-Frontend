import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EventsAdministrationComponent} from './events-administration/events-administration.component';

const eventRoutes: Routes = [
  {
    path: '', children: [
      {path: 'administration', component: EventsAdministrationComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(eventRoutes)
  ],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}
