import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {DfxTranslateModule} from 'dfx-translate';
import {MaterialModule} from '../../material-module';
import {SeatReservationRoutingModule} from './seatReservation-routing.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';

import {SeatReservationComponent} from './seat-reservation.component';

@NgModule({
  declarations: [SeatReservationComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule, SeatReservationRoutingModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [],
})
export class SeatReservationModule {}
