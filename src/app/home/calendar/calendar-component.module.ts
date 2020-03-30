import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {MaterialModule} from '../../material-module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {TranslationModule} from '../../translation/translation.module';
import {CalendarComponentRoutingModule} from './calendar-component-routing.module';
import {CalendarAgendaComponent} from './calendar-agenda/calendar-agenda.component';
import {CalendarComponent} from './calendar.component';

@NgModule({
  declarations: [CalendarComponent, CalendarAgendaComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslationModule,
    FormsModule,
    CommonComponentsModule,
    CalendarComponentRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class CalendarComponentModule {}
