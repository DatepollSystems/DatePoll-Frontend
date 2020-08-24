import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventInfoViewComponent} from './event-info/event-info-view/event-info-view.component';
import {EventCreateComponent} from './events-administration/event-create/event-create.component';
import {EventsAdministrationComponent} from './events-administration/events-administration.component';
import {EventsViewComponent} from './events-view/events-view.component';

const eventRoutes: Routes = [
  {
    path: '',
    children: [
      {path: 'administration', component: EventsAdministrationComponent},
      {path: 'administration/create', component: EventCreateComponent},
      {path: 'start', component: EventsViewComponent},
      {path: ':id', component: EventInfoViewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(eventRoutes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
