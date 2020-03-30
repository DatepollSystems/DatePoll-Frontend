import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../../../material-module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../services/custom-date-adapter';
import {MapsModule} from '../../../services/shared-components/maps-component/maps.module';
import {TranslationModule} from '../../../translation/translation.module';
import {EventDatesListComponentModule} from '../event-dates-list/event-dates-list-component.module';

import {EventUserManagementComponent} from '../events-administration/event-user-management-modal/event-user-management/event-user-management.component';
import {EventsVoteForDecisionAdditionalInformationModalComponent} from '../events-view/events-vote-for-decision-modal/events-vote-for-decision-additional-information-modal/events-vote-for-decision-additional-information-modal.component';
import {EventsVoteForDecisionModalComponent} from '../events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {EventInfoModalComponent} from './event-info-modal/event-info-modal.component';
import {EventInfoViewComponent} from './event-info-view/event-info-view.component';
import {EventInfoComponent} from './event-info.component';
import {GroupInfoCardComponent} from './group-info-card/group-info-card.component';
import {SubgroupInfoCardComponent} from './group-info-card/subgroup-info-card/subgroup-info-card.component';
import {ResultUserBarChartComponent} from './result-user-bar-chart/result-user-bar-chart.component';
import {ResultUserTableComponent} from './result-user-table/result-user-table.component';

@NgModule({
  declarations: [
    EventInfoModalComponent,
    EventInfoComponent,
    EventInfoViewComponent,
    ResultUserTableComponent,
    ResultUserBarChartComponent,
    EventUserManagementComponent,
    GroupInfoCardComponent,
    SubgroupInfoCardComponent,
    EventsVoteForDecisionModalComponent,
    EventsVoteForDecisionAdditionalInformationModalComponent
  ],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, TranslationModule, MapsModule, EventDatesListComponentModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  exports: [EventInfoModalComponent, EventUserManagementComponent]
})
export class EventInfoModule {}
