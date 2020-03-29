import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {StartRoutingModule} from './start-routing.module';

import {StartComponent} from './start.component';
import {TableBookingsRowComponent} from './table-bookings-row/table-bookings-row.component';

@NgModule({
  declarations: [StartComponent, TableBookingsRowComponent],
  imports: [CommonModule, MaterialModule, TranslationModule, StartRoutingModule]
})
export class StartModule {}