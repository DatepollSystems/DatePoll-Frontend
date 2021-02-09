import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {NgxPrintModule} from 'ngx-print';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../utils/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';
import {CinemaRoutingModule} from './cinema-routing.module';

import {CinemaService} from './cinema.service';

import {MovieServiceComponent} from './movie-service/movie-service.component';
import {MovieBookTicketsModalComponent} from './movie-tickets/movie-ticket/movie-book-tickets-modal/movie-book-tickets-modal.component';
import {MovieTicketComponent} from './movie-tickets/movie-ticket/movie-ticket.component';
import {MovieWeatherforecastModalComponent} from './movie-tickets/movie-ticket/movie-weatherforecast-modal/movie-weatherforecast-modal.component';
import {MovieTicketsComponent} from './movie-tickets/movie-tickets.component';
import {MovieWorkerNumbersModalComponent} from './movie-tickets/movie-ticket/movie-worker-numbers-modal/movie-worker-numbers-modal.component';

@NgModule({
  declarations: [
    MovieTicketsComponent,
    MovieServiceComponent,
    MovieTicketComponent,
    MovieBookTicketsModalComponent,
    MovieWeatherforecastModalComponent,
    MovieWorkerNumbersModalComponent,
  ],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, CommonComponentsModule, NgxPrintModule, CinemaRoutingModule],
  providers: [CinemaService, {provide: DateAdapter, useClass: CustomDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}],
})
export class CinemaModule {}
