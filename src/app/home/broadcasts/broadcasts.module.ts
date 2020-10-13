import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../../material-module';
import {TranslationModule} from '../../translation/translation.module';
import {EditorPreviewModule} from '../../utils/shared-components/editor-preview/editor-preview.module';
import {GoBackButtonModule} from '../../utils/shared-components/go-back-button/go-back-button.module';
import {BroadcastsRoutingModule} from './broadcasts-routing.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from '../../utils/custom-date-adapter';

import {BroadcastInfoComponent} from './broadcast-info/broadcast-info.component';
import {BroadcastsViewComponent} from './broadcasts-view/broadcasts-view.component';
import {BroadcastAttachmentCardComponent} from './broadcast-info/broadcast-attachment-card/broadcast-attachment-card.component';

@NgModule({
  declarations: [BroadcastInfoComponent, BroadcastsViewComponent, BroadcastAttachmentCardComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, GoBackButtonModule, EditorPreviewModule, BroadcastsRoutingModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  exports: [BroadcastAttachmentCardComponent],
})
export class BroadcastsModule {}
