import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../utils/custom-date-adapter';
import {AllMembersSwitchModule} from '../../../utils/shared-components/all-members-switch/all-members-switch.module';
import {EditorPreviewModule} from '../../../utils/shared-components/editor-preview/editor-preview.module';
import {EditorModule} from '../../../utils/shared-components/editor/editor.module';
import {GroupAndSubgroupTypeInputSelectModule} from '../../../utils/shared-components/group-and-subgroup-type-input-select/group-and-subgroup-type-input-select.module';
import {QuestionDialogComponentModule} from '../../../utils/shared-components/question-dialog/question-dialog-component.module';
import {BroadcastsAdministrationRoutingModule} from './broadcasts-administration-routing.module';

import {BroadcastAdminInfoComponent} from './broadcast-admin-info/broadcast-admin-info.component';
import {BroadcastsAdministrationComponent} from './broadcasts-administration.component';
import {CreateBroadcastComponent} from './create-broadcast/create-broadcast.component';
import {LoadDraftDialogComponent} from './create-broadcast/load-draft-dialog/load-draft-dialog-component';
import {BroadcastAttachmentComponent} from './create-broadcast/broadcast-attachment/broadcast-attachment.component';
import {BroadcastsModule} from '../broadcasts.module';
import {GoBackButtonModule} from '../../../utils/shared-components/go-back-button/go-back-button.module';
import {YearSelectModule} from '../../../utils/shared-components/year-select/year-select.module';

@NgModule({
  declarations: [
    BroadcastsAdministrationComponent,
    CreateBroadcastComponent,
    BroadcastAdminInfoComponent,
    LoadDraftDialogComponent,
    BroadcastAttachmentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DfxTranslateModule,
    EditorModule,
    NgxMatSelectSearchModule,
    QuestionDialogComponentModule,
    AllMembersSwitchModule,
    GroupAndSubgroupTypeInputSelectModule,
    FormsModule,
    EditorPreviewModule,
    BroadcastsAdministrationRoutingModule,
    BroadcastsModule,
    GoBackButtonModule,
    YearSelectModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class BroadcastsAdministrationModule {}
