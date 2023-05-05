import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../utils/custom-date-adapter';
import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {MovieAdministrationRoutingModule} from './movie-administration-routing.module';
import {CommonComponentsModule} from '../../../utils/common-components.module';

import {CommonMovieAdministrationComponentsModule} from './common-movie-administration-components.module';
import {MovieAdministrationComponent} from './movie-administration.component';
import {YearSelectModule} from '../../../utils/shared-components/year-select/year-select.module';

@NgModule({
  declarations: [MovieAdministrationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MaterialModule,
    CommonComponentsModule,
    DfxTranslateModule,
    CommonMovieAdministrationComponentsModule,
    MovieAdministrationRoutingModule,
    YearSelectModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class MovieAdministrationModule {}
