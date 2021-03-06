import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {MaterialModule} from '../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {EditorPreviewModule} from '../../utils/shared-components/editor-preview/editor-preview.module';
import {BroadcastsRoutingModule} from './broadcasts-routing.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';

import {BroadcastInfoComponent} from './broadcast-info/broadcast-info.component';
import {BroadcastsViewComponent} from './broadcasts-view/broadcasts-view.component';
import {BroadcastAttachmentCardComponent} from './broadcast-info/broadcast-attachment-card/broadcast-attachment-card.component';
import {GoBackButtonModule} from '../../utils/shared-components/go-back-button/go-back-button.module';

@NgModule({
  declarations: [BroadcastInfoComponent, BroadcastsViewComponent, BroadcastAttachmentCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    DfxTranslateModule,
    GoBackButtonModule,
    EditorPreviewModule,
    InfiniteScrollModule,
    BroadcastsRoutingModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [BroadcastAttachmentCardComponent],
})
export class BroadcastsModule {}
