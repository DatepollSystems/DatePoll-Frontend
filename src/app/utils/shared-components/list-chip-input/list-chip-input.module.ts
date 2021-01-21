import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {ListChipInputComponent} from './list-chip-input.component';

@NgModule({
  declarations: [ListChipInputComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, ReactiveFormsModule],
  exports: [ListChipInputComponent],
})
export class ListChipInputModule {}
