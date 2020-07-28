import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';
import {BroadcastInfoComponent} from './broadcast-info/broadcast-info.component';
import {BroadcastsRoutingModule} from './broadcasts-routing.module';
import {BroadcastsViewComponent} from './broadcasts-view/broadcasts-view.component';
@NgModule({
  declarations: [BroadcastInfoComponent, BroadcastsViewComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, BroadcastsRoutingModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class BroadcastsModule {}
