import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ColorGithubModule} from 'ngx-color/github';
import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {ColorPickerComponent} from './color-picker.component';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule, ColorGithubModule],
  exports: [ColorPickerComponent],
})
export class ColorPickerComponentModule {}
