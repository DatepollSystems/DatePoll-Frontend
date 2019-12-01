import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {CustomFormsModule} from 'ng2-validation';
import {ChartsModule} from 'ng2-charts';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../services/custom-date-adapter';
import {EventInfoModalComponent} from './event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from './events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {EventDecisionsListComponent} from './event-decisions-list/event-decisions-list.component';
import {GroupInfoCardComponent} from './event-info-modal/group-info-card/group-info-card.component';
import {SubgroupInfoCardComponent} from './event-info-modal/group-info-card/subgroup-info-card/subgroup-info-card.component';
import {ResultUserTableComponent} from './event-info-modal/result-user-table/result-user-table.component';
import {ResultUserBarChartComponent} from './event-info-modal/result-user-bar-chart/result-user-bar-chart.component';
import {EventUpdateModalComponent} from './events-administration/event-update-modal/event-update-modal.component';
import {EventDeleteModalComponent} from './events-administration/event-delete-modal/event-delete-modal.component';

@NgModule({
  declarations: [
    EventInfoModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    ResultUserTableComponent,
    ResultUserBarChartComponent,
    GroupInfoCardComponent,
    SubgroupInfoCardComponent,
    EventsVoteForDecisionModalComponent,
    EventDecisionsListComponent
  ],
  entryComponents: [
    EventInfoModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    EventsVoteForDecisionModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    ChartsModule,
    CommonComponentsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [
    EventInfoModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    EventsVoteForDecisionModalComponent,
    EventDecisionsListComponent
  ]
})
export class CommonEventsComponentsModule {
}
