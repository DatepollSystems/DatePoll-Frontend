import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {TimeInputComponent} from './time-input.component';

@NgModule({
  declarations: [TimeInputComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule],
  exports: [TimeInputComponent],
})
export class TimeInputModule {}
