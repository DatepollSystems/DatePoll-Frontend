import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../services/custom-date-adapter';
import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {MovieAdministrationRoutingModule} from './movie-administration-routing.module';
import {CommonComponentsModule} from '../../../services/common-components.module';

import {CommonMovieAdministrationComponentsModule} from './common-movie-administration-components.module';
import {MovieAdministrationComponent} from './movie-administration.component';

@NgModule({
  declarations: [
    MovieAdministrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MaterialModule,
    CommonComponentsModule,
    TranslationModule,
    CommonMovieAdministrationComponentsModule,
    MovieAdministrationRoutingModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})
export class MovieAdministrationModule {
}
