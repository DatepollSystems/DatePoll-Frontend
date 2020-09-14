import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {EditorPreviewComponent} from './editor-preview.component';

@NgModule({
  declarations: [EditorPreviewComponent],
  imports: [CommonModule],
  exports: [EditorPreviewComponent]
})
export class EditorPreviewModule {}
