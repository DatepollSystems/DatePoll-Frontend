import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';
import {GoBackButtonModule} from '../../utils/shared-components/go-back-button/go-back-button.module';
import {GroupAndSubgroupTypeInputSelectModule} from '../../utils/shared-components/group-and-subgroup-type-input-select/group-and-subgroup-type-input-select.module';
import {MapsModule} from '../../utils/shared-components/maps-component/maps.module';
import {EventInfoModule} from './event-info/event-info.module';
import {EventsRoutingModule} from './events-routing.module';
import {AllMembersSwitchModule} from '../../utils/shared-components/all-members-switch/all-members-switch.module';

import {ColorPickerComponentModule} from '../../utils/shared-components/color-picker/color-picker-component.module';
import {CommonEventsComponentsModule} from './common-events-components.module';
import {EventCreateComponent} from './events-administration/event-create/event-create.component';
import {EventStandardDecisionsManagementModalComponent} from './events-administration/event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventStandardLocationsManagementModalComponent} from './events-administration/event-standard-locations-management-modal/event-standard-locations-management-modal.component';
import {EventUserManagementModalComponent} from './events-administration/event-user-management-modal/event-user-management-modal.component';
import {EventsAdministrationComponent} from './events-administration/events-administration.component';
import {YearSelectModule} from '../../utils/shared-components/year-select/year-select.module';
import {StartModule} from '../start/start.module';
import {BooleanTranslationModule} from '../../utils/shared-components/boolean-translation/boolean-translation.module';

@NgModule({
  declarations: [
    EventsAdministrationComponent,
    EventCreateComponent,
    EventUserManagementModalComponent,
    EventStandardDecisionsManagementModalComponent,
    EventStandardLocationsManagementModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DfxTranslateModule,
    CommonEventsComponentsModule,
    ColorPickerComponentModule,
    MapsModule,
    EventInfoModule,
    EventsRoutingModule,
    GroupAndSubgroupTypeInputSelectModule,
    NgxMatSelectSearchModule,
    GoBackButtonModule,
    BooleanTranslationModule,
    AllMembersSwitchModule,
    YearSelectModule,
    StartModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class EventsModule {}
