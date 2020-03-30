import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {RouterModule} from '@angular/router';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../material-module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../services/custom-date-adapter';
import {ColorPickerComponentModule} from '../../services/shared-components/color-picker/color-picker-component.module';
import {MapsModule} from '../../services/shared-components/maps-component/maps.module';
import {QuestionDialogComponentModule} from '../../services/shared-components/question-dialog/question-dialog-component.module';
import {TranslationModule} from '../../translation/translation.module';
import {EventDatesListComponentModule} from './event-dates-list/event-dates-list-component.module';

import {EventsUserService} from './events-user.service';

import {EventDatesManagementComponent} from './events-administration/event-dates-management/event-dates-management.component';
import {EventStandardLocationsSelectComponent} from './events-administration/event-dates-management/event-standard-locations-select/event-standard-locations-select.component';
import {EventDecisionsListComponent} from './events-administration/event-decisions-list/event-decisions-list.component';
import {EventUpdateModalComponent} from './events-administration/event-update-modal/event-update-modal.component';
import {EventCardComponent} from './events-view/event-card/event-card.component';

@NgModule({
  declarations: [
    EventUpdateModalComponent,
    EventDecisionsListComponent,
    EventDatesManagementComponent,
    EventStandardLocationsSelectComponent,
    EventCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
    NgxMatSelectSearchModule,
    QuestionDialogComponentModule,
    ColorPickerComponentModule,
    EventDatesListComponentModule,
    MapsModule,
    CommonComponentsModule
  ],
  providers: [
    EventsUserService,
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  exports: [EventUpdateModalComponent, EventDecisionsListComponent, EventDatesManagementComponent, EventCardComponent]
})
export class CommonEventsComponentsModule {}
