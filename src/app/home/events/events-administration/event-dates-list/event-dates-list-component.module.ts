import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../../utils/custom-date-adapter';
import {MapsModule} from '../../../../utils/shared-components/maps-component/maps.module';

import {EventDatesListComponent} from './event-dates-list.component';

@NgModule({
  declarations: [EventDatesListComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule, MapsModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [EventDatesListComponent],
})
export class EventDatesListComponentModule {}
