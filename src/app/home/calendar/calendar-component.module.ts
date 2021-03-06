import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {MaterialModule} from '../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {CommonComponentsModule} from '../../utils/common-components.module';
import {CalendarComponentRoutingModule} from './calendar-component-routing.module';

import {CalendarComponent} from './calendar.component';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DfxTranslateModule,
    FormsModule,
    CommonComponentsModule,
    CalendarComponentRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class CalendarComponentModule {}
