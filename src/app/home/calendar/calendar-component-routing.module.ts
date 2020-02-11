import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarAgendaComponent} from './calendar-agenda/calendar-agenda.component';
import {CalendarComponent} from './calendar.component';

const calendarRoutes: Routes = [
  {path: '', component: CalendarComponent},
  {path: 'agenda', component: CalendarAgendaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(calendarRoutes)],
  exports: [RouterModule]
})
export class CalendarComponentRoutingModule {}
