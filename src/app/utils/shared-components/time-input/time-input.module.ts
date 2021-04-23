import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {TimeInputComponent} from './time-input.component';

@NgModule({
  declarations: [TimeInputComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule],
  exports: [TimeInputComponent],
})
export class TimeInputModule {}
