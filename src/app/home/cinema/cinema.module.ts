import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../material-module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../services/custom-date-adapter';
import {TranslationModule} from '../../translation/translation.module';
import {CinemaRoutingModule} from './cinema-routing.module';

import {CinemaService} from './cinema.service';

import {MovieServiceComponent} from './movie-service/movie-service.component';
import {MovieBookTicketsModalComponent} from './movie-tickets/movie-ticket/movie-book-tickets-modal/movie-book-tickets-modal.component';
import {MovieTicketComponent} from './movie-tickets/movie-ticket/movie-ticket.component';
import {MovieWeatherforecastModalComponent} from './movie-tickets/movie-ticket/movie-weatherforecast-modal/movie-weatherforecast-modal.component';
import {MovieTicketsComponent} from './movie-tickets/movie-tickets.component';

@NgModule({
  declarations: [
    MovieTicketsComponent,
    MovieServiceComponent,
    MovieTicketComponent,
    MovieBookTicketsModalComponent,
    MovieWeatherforecastModalComponent
  ],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, CommonComponentsModule, CinemaRoutingModule],
  providers: [CinemaService, {provide: DateAdapter, useClass: CustomDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}]
})
export class CinemaModule {}
