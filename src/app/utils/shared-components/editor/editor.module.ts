import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {QuillModule} from 'ngx-quill';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {EditorPreviewModule} from '../editor-preview/editor-preview.module';

import {EditorComponent} from './editor.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, EditorPreviewModule, QuillModule.forRoot()],
  exports: [EditorComponent],
})
export class EditorModule {}
