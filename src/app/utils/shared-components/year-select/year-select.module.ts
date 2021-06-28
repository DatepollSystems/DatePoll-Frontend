import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {YearSelectComponent} from './year-select.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

@NgModule({
  declarations: [YearSelectComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, NgxMatSelectSearchModule, ReactiveFormsModule],
  exports: [YearSelectComponent],
})
export class YearSelectModule {}
