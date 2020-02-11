import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../../material-module';

import {CommonComponentsModule} from '../../../services/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../services/custom-date-adapter';
import {TranslationModule} from '../../../translation/translation.module';
import {MovieBookingsModalComponent} from './movie-bookings-modal/movie-bookings-modal.component';
import {MovieBookingsTableComponent} from './movie-bookings-table/movie-bookings-table.component';
import {MovieCreateModalComponent} from './movie-create-modal/movie-create-modal.component';
import {MovieDeleteModalComponent} from './movie-delete-modal/movie-delete-modal.component';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from './movie-info-modal/movie-info-modal.component';

@NgModule({
  declarations: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent,
    MovieBookingsTableComponent,
    MovieBookingsModalComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, CommonComponentsModule, TranslationModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  exports: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent,
    MovieBookingsModalComponent
  ]
})
export class CommonMovieAdministrationComponentsModule {}
