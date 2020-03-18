import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MaterialModule} from '../../material-module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {ColorPickerComponentModule} from '../../services/shared-components/color-picker/color-picker-component.module';
import {TranslationModule} from '../../translation/translation.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../services/custom-date-adapter';
import {EventDatesListComponent} from './event-dates-list/event-dates-list.component';
import {EventDecisionsListComponent} from './event-decisions-list/event-decisions-list.component';
import {EventInfoModalComponent} from './event-info/event-info-modal/event-info-modal.component';
import {GroupInfoCardComponent} from './event-info/group-info-card/group-info-card.component';
import {SubgroupInfoCardComponent} from './event-info/group-info-card/subgroup-info-card/subgroup-info-card.component';
import {ResultUserBarChartComponent} from './event-info/result-user-bar-chart/result-user-bar-chart.component';
import {ResultUserTableComponent} from './event-info/result-user-table/result-user-table.component';
import {EventDatesManagementComponent} from './events-administration/event-dates-management/event-dates-management.component';
import {EventStandardLocationsSelectComponent} from './events-administration/event-dates-management/event-standard-locations-select/event-standard-locations-select.component';
import {EventDeleteModalComponent} from './events-administration/event-delete-modal/event-delete-modal.component';
import {EventUpdateModalComponent} from './events-administration/event-update-modal/event-update-modal.component';
import {EventUserManagementComponent} from './events-administration/event-user-management-modal/event-user-management/event-user-management.component';
import {EventCardComponent} from './events-view/event-card/event-card.component';
import {EventsVoteForDecisionAdditionalInformationModalComponent} from './events-view/events-vote-for-decision-modal/events-vote-for-decision-additional-information-modal/events-vote-for-decision-additional-information-modal.component';
import {EventsVoteForDecisionModalComponent} from './events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {EventInfoComponent} from './event-info/event-info.component';
import {EventInfoViewComponent} from './event-info/event-info-view/event-info-view.component';

@NgModule({
  declarations: [
    EventInfoModalComponent,
    EventInfoComponent,
    EventInfoViewComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    ResultUserTableComponent,
    ResultUserBarChartComponent,
    GroupInfoCardComponent,
    SubgroupInfoCardComponent,
    EventsVoteForDecisionModalComponent,
    EventsVoteForDecisionAdditionalInformationModalComponent,
    EventDecisionsListComponent,
    EventDatesManagementComponent,
    EventDatesListComponent,
    EventUserManagementComponent,
    EventStandardLocationsSelectComponent,
    EventCardComponent
  ],
  entryComponents: [
    EventInfoModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    EventsVoteForDecisionModalComponent,
    EventsVoteForDecisionAdditionalInformationModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
    NgxMatSelectSearchModule,
    ColorPickerComponentModule,
    CommonComponentsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  exports: [
    EventInfoModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    EventsVoteForDecisionModalComponent,
    EventsVoteForDecisionAdditionalInformationModalComponent,
    EventDecisionsListComponent,
    EventDatesManagementComponent,
    EventDatesListComponent,
    EventUserManagementComponent,
    EventCardComponent
  ]
})
export class CommonEventsComponentsModule {}
