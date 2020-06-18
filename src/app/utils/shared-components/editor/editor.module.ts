import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {QuillModule} from 'ngx-quill';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';

import {EditorComponent} from './editor.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, QuillModule.forRoot()],
  exports: [EditorComponent]
})
export class EditorModule {}
