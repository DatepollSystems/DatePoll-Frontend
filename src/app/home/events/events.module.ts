import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {EventsRoutingModule} from './events-routing.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../services/custom-date-adapter';

import {CommonEventsComponentsModule} from './common-events-components.module';
import {EventsAdministrationComponent} from './events-administration/events-administration.component';
import {EventCreateModalComponent} from './events-administration/event-create-modal/event-create-modal.component';
import {EventStandardDecisionsManagementModalComponent} from './events-administration/event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventsViewComponent} from './events-view/events-view.component';
import {EventUserManagementModalComponent} from './events-administration/event-user-management-modal/event-user-management-modal.component';
import {EventStandardLocationsManagementModalComponent} from './events-administration/event-standard-locations-management-modal/event-standard-locations-management-modal.component';

@NgModule({
  declarations: [
    EventsAdministrationComponent,
    EventCreateModalComponent,
    EventUserManagementModalComponent,
    EventStandardDecisionsManagementModalComponent,
    EventStandardLocationsManagementModalComponent,
    EventsViewComponent
  ],
  entryComponents: [
    EventCreateModalComponent,
    EventUserManagementModalComponent,
    EventStandardDecisionsManagementModalComponent,
    EventStandardLocationsManagementModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    CommonComponentsModule,
    CommonEventsComponentsModule,
    EventsRoutingModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class EventsModule {}
