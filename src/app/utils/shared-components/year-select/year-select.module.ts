import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {YearSelectComponent} from './year-select.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

@NgModule({
  declarations: [YearSelectComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, NgxMatSelectSearchModule, ReactiveFormsModule],
  exports: [YearSelectComponent],
})
export class YearSelectModule {}
