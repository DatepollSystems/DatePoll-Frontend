import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {RouterModule} from '@angular/router';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../utils/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';
import {ColorPickerComponentModule} from '../../utils/shared-components/color-picker/color-picker-component.module';
import {GroupAndSubgroupTypeInputSelectModule} from '../../utils/shared-components/group-and-subgroup-type-input-select/group-and-subgroup-type-input-select.module';
import {MapsModule} from '../../utils/shared-components/maps-component/maps.module';
import {QuestionDialogComponentModule} from '../../utils/shared-components/question-dialog/question-dialog-component.module';
import {EventDatesListComponentModule} from './events-administration/event-dates-list/event-dates-list-component.module';
import {AllMembersSwitchModule} from '../../utils/shared-components/all-members-switch/all-members-switch.module';

import {EventsUserService} from './services/events-user.service';

import {EventDatesManagementComponent} from './events-administration/event-dates-management/event-dates-management.component';
import {EventStandardLocationsSelectComponent} from './events-administration/event-dates-management/event-standard-locations-select/event-standard-locations-select.component';
import {EventDecisionsListComponent} from './events-administration/event-decisions-list/event-decisions-list.component';
import {EventUpdateModalComponent} from './events-administration/event-update-modal/event-update-modal.component';
import {TimeInputModule} from '../../utils/shared-components/time-input/time-input.module';

@NgModule({
  declarations: [
    EventUpdateModalComponent,
    EventDecisionsListComponent,
    EventDatesManagementComponent,
    EventStandardLocationsSelectComponent,
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
    CommonComponentsModule,
    GroupAndSubgroupTypeInputSelectModule,
    AllMembersSwitchModule,
    TimeInputModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [EventUpdateModalComponent, EventDecisionsListComponent, EventDatesManagementComponent],
})
export class CommonEventsComponentsModule {}
