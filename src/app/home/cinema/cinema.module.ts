import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CinemaRoutingModule} from './cinema-routing.module';

import {MovieCreateModalComponent} from './movie-administration/movie-create-modal/movie-create-modal.component';
import {MovieBookTicketsModalComponent} from './movie-tickets/movie-ticket/movie-book-tickets-modal/movie-book-tickets-modal.component';
import {MovieTicketsComponent} from './movie-tickets/movie-tickets.component';
import {MovieServiceComponent} from './movie-service/movie-service.component';
import {MovieAdministrationComponent} from './movie-administration/movie-administration.component';
import {MovieTicketComponent} from './movie-tickets/movie-ticket/movie-ticket.component';

@NgModule({
  declarations: [
    MovieTicketsComponent,
    MovieServiceComponent,
    MovieAdministrationComponent,
    MovieTicketComponent,
    MovieBookTicketsModalComponent,
    MovieCreateModalComponent
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
    MovieBookTicketsModalComponent
  ]
})
export class CinemaModule {
}
