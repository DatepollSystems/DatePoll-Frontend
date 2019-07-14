import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';

import {CustomFormsModule} from 'ng2-validation';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CinemaRoutingModule} from './cinema-routing.module';
import {CustomDateAdapter} from '../../services/custom-date-adapter';

import {MovieCreateModalComponent} from './movie-administration/movie-create-modal/movie-create-modal.component';
import {MovieBookTicketsModalComponent} from './movie-tickets/movie-ticket/movie-book-tickets-modal/movie-book-tickets-modal.component';
import {MovieTicketsComponent} from './movie-tickets/movie-tickets.component';
import {MovieServiceComponent} from './movie-service/movie-service.component';
import {MovieAdministrationComponent} from './movie-administration/movie-administration.component';
import {MovieTicketComponent} from './movie-tickets/movie-ticket/movie-ticket.component';
import {MovieWeatherforecastModalComponent} from './movie-tickets/movie-ticket/movie-weatherforecast-modal/movie-weatherforecast-modal.component';

@NgModule({
  declarations: [
    MovieTicketsComponent,
    MovieServiceComponent,
    MovieAdministrationComponent,
    MovieTicketComponent,
    MovieBookTicketsModalComponent,
    MovieCreateModalComponent,
    MovieWeatherforecastModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    NgxMatSelectSearchModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    CinemaRoutingModule
  ],
  entryComponents: [
    MovieCreateModalComponent,
    MovieBookTicketsModalComponent,
    MovieWeatherforecastModalComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class CinemaModule {
}
