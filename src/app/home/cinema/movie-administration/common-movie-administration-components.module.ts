import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';

import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from './movie-info-modal/movie-info-modal.component';
import {MovieDeleteModalComponent} from './movie-delete-modal/movie-delete-modal.component';
import {MovieCreateModalComponent} from './movie-create-modal/movie-create-modal.component';
import {CustomDateAdapter} from '../../../services/custom-date-adapter';
import {CommonComponentsModule} from '../../../services/common-components.module';
import {MovieBookingsTableComponent} from './movie-bookings-table/movie-bookings-table.component';

@NgModule({
  declarations: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent,
    MovieBookingsTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    CommonComponentsModule,
    TranslationModule,
  ],
  entryComponents: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ],
  exports: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent
  ]
})
export class CommonMovieAdministrationComponentsModule {
}
