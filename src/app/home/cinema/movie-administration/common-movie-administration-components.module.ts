import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../../../material-module';

import {TranslationModule} from '../../../translation/translation.module';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from './movie-info-modal/movie-info-modal.component';
import {MovieDeleteModalComponent} from './movie-delete-modal/movie-delete-modal.component';
import {MovieCreateModalComponent} from './movie-create-modal/movie-create-modal.component';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../services/custom-date-adapter';
import {CommonComponentsModule} from '../../../services/common-components.module';
import {MovieBookingsTableComponent} from './movie-bookings-table/movie-bookings-table.component';
import {MovieBookingsModalComponent} from './movie-bookings-modal/movie-bookings-modal.component';

@NgModule({
  declarations: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent,
    MovieBookingsTableComponent,
    MovieBookingsModalComponent,
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
    MovieDeleteModalComponent,
    MovieBookingsModalComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [
    MovieCreateModalComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    MovieDeleteModalComponent,
    MovieBookingsModalComponent
  ]
})
export class CommonMovieAdministrationComponentsModule {
}
