import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsViewComponent} from './events-view.component';

const eventViewRoutes: Routes = [{path: '', component: EventsViewComponent}];

@NgModule({
  imports: [RouterModule.forChild(eventViewRoutes)],
  exports: [RouterModule],
})
export class EventsViewRoutingModule {}
