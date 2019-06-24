import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CommonEventsComponentsModule} from '../events/common-events-components.module';
import {CalendarComponentRoutingModule} from './calendar-component-routing.module';

import {CalendarComponent} from './calendar.component';

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    CommonEventsComponentsModule,
    CalendarComponentRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class CalendarComponentModule {
}
