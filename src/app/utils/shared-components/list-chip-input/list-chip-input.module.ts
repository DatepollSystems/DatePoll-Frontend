import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {ListChipInputComponent} from './list-chip-input.component';

@NgModule({
  declarations: [ListChipInputComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, ReactiveFormsModule],
  exports: [ListChipInputComponent],
})
export class ListChipInputModule {}
