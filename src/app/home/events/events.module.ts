import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';

import {CustomFormsModule} from 'ng2-validation';
import {ChartsModule} from 'ng2-charts';


import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {EventsRoutingModule} from './events-routing.module';
import {CustomDateAdapter} from '../../services/custom-date-adapter';

import {EventsAdministrationComponent} from './events-administration/events-administration.component';
import {EventCreateModalComponent} from './event-create-modal/event-create-modal.component';
import {EventUpdateModalComponent} from './event-update-modal/event-update-modal.component';
import {EventInfoModalComponent} from './event-info-modal/event-info-modal.component';
import {EventStandardDecisionsManagementModalComponent} from './event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventDecisionsListComponent} from './event-decisions-list/event-decisions-list.component';

@NgModule({
  declarations: [
    EventsAdministrationComponent,
    EventCreateModalComponent,
    EventUpdateModalComponent,
    EventInfoModalComponent,
    EventStandardDecisionsManagementModalComponent,
    EventDecisionsListComponent
  ],
  entryComponents: [
    EventCreateModalComponent,
    EventUpdateModalComponent,
    EventInfoModalComponent,
    EventStandardDecisionsManagementModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    ChartsModule,
    EventsRoutingModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class EventsModule {
}
