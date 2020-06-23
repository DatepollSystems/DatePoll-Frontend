import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';
import {BroadcastsRoutingModule} from './broadcasts-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule, TranslationModule, BroadcastsRoutingModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class BroadcastsModule {}
