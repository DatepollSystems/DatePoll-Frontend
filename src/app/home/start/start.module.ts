import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {StartRoutingModule} from './start-routing.module';

import {HomepageService} from './homepage.service';

import {StartComponent} from './start.component';
import {TableBookingsRowComponent} from './table-bookings-row/table-bookings-row.component';
import {EventsViewModule} from '../events/events-view/events-view.module';

@NgModule({
  declarations: [StartComponent, TableBookingsRowComponent],
  imports: [CommonModule, MaterialModule, TranslationModule, StartRoutingModule, EventsViewModule],
  providers: [HomepageService],
})
export class StartModule {}
