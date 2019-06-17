import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';

import {CustomFormsModule} from 'ng2-validation';
import {ChartsModule} from 'ng2-charts';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CustomDateAdapter} from '../../services/custom-date-adapter';

import {EventInfoModalComponent} from './event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from './events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';

@NgModule({
  declarations: [
    EventInfoModalComponent,
    EventsVoteForDecisionModalComponent
  ],
  entryComponents: [
    EventInfoModalComponent,
    EventsVoteForDecisionModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    ChartsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ],
  exports: [
    EventInfoModalComponent,
    EventsVoteForDecisionModalComponent
  ]
})
export class CommonEventsComponentsModule {
}
