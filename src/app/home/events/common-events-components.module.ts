import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';

import {CustomFormsModule} from 'ng2-validation';
import {ChartsModule} from 'ng2-charts';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CustomDateAdapter} from '../../services/custom-date-adapter';

import {EventInfoModalComponent} from './event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from './events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {EventUpdateModalComponent} from './events-administration/event-update-modal/event-update-modal.component';
import {EventDeleteModalComponent} from './events-administration/event-delete-modal/event-delete-modal.component';
import {EventDecisionsListComponent} from './event-decisions-list/event-decisions-list.component';

@NgModule({
  declarations: [
    EventInfoModalComponent,
    EventsVoteForDecisionModalComponent,
    EventDecisionsListComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent
  ],
  entryComponents: [
    EventInfoModalComponent,
    EventsVoteForDecisionModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent
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
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ],
  exports: [
    EventInfoModalComponent,
    EventsVoteForDecisionModalComponent,
    EventUpdateModalComponent,
    EventDeleteModalComponent,
    EventDecisionsListComponent
  ]
})
export class CommonEventsComponentsModule {
}
