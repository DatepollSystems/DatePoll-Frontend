import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../utils/custom-date-adapter';
import {AllMembersSwitchModule} from '../../../utils/shared-components/all-members-switch/all-members-switch.module';
import {EditorModule} from '../../../utils/shared-components/editor/editor.module';
import {GroupAndSubgroupTypeInputSelectModule} from '../../../utils/shared-components/group-and-subgroup-type-input-select/group-and-subgroup-type-input-select.module';
import {QuestionDialogComponentModule} from '../../../utils/shared-components/question-dialog/question-dialog-component.module';
import {BroadcastsAdministrationRoutingModule} from './broadcasts-administration-routing.module';

import {BroadcastsAdministrationComponent} from './broadcasts-administration.component';
import {CreateBroadcastComponent} from './create-broadcast/create-broadcast.component';

@NgModule({
  declarations: [BroadcastsAdministrationComponent, CreateBroadcastComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslationModule,
    EditorModule,
    NgxMatSelectSearchModule,
    QuestionDialogComponentModule,
    AllMembersSwitchModule,
    GroupAndSubgroupTypeInputSelectModule,
    BroadcastsAdministrationRoutingModule,
    FormsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class BroadcastsAdministrationModule {}
