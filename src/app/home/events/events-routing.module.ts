import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EventsAdministrationComponent} from './events-administration/events-administration.component';
import {EventsViewComponent} from './events-view/events-view.component';

const eventRoutes: Routes = [
  {
    path: '',
    children: [
      {path: 'administration', component: EventsAdministrationComponent},
      {path: '', component: EventsViewComponent},
      {path: ':id', component: EventsViewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(eventRoutes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
