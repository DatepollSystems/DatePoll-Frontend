import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {EventsViewRoutingModule} from './events-view-routing.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../utils/custom-date-adapter';

import {EventsViewComponent} from './events-view.component';
import {EventsVoteForDecisionModalComponent} from './events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {EventListItemComponent} from './event-list-item/event-list-item.component';
import {EventsVoteForDecisionAdditionalInformationModalComponent} from './events-vote-for-decision-modal/events-vote-for-decision-additional-information-modal/events-vote-for-decision-additional-information-modal.component';
import {GoBackButtonModule} from '../../../utils/shared-components/go-back-button/go-back-button.module';

@NgModule({
  declarations: [
    EventsViewComponent,
    EventsVoteForDecisionModalComponent,
    EventsVoteForDecisionAdditionalInformationModalComponent,
    EventListItemComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, EventsViewRoutingModule, TranslationModule, GoBackButtonModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [EventListItemComponent],
})
export class EventsViewModule {}
