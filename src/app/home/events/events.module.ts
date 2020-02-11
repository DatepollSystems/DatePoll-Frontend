import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../material-module';
import {CommonComponentsModule} from '../../services/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../services/custom-date-adapter';
import {TranslationModule} from '../../translation/translation.module';
import {EventsRoutingModule} from './events-routing.module';

import {CommonEventsComponentsModule} from './common-events-components.module';
import {EventCreateModalComponent} from './events-administration/event-create-modal/event-create-modal.component';
import {EventStandardDecisionsManagementModalComponent} from './events-administration/event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventStandardLocationsManagementModalComponent} from './events-administration/event-standard-locations-management-modal/event-standard-locations-management-modal.component';
import {EventUserManagementModalComponent} from './events-administration/event-user-management-modal/event-user-management-modal.component';
import {EventsAdministrationComponent} from './events-administration/events-administration.component';
import {EventsViewComponent} from './events-view/events-view.component';

@NgModule({
  declarations: [
    EventsAdministrationComponent,
    EventCreateModalComponent,
    EventUserManagementModalComponent,
    EventStandardDecisionsManagementModalComponent,
    EventStandardLocationsManagementModalComponent,
    EventsViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
