import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {QuestionDialogComponent} from './question-dialog.component';

@NgModule({
  declarations: [QuestionDialogComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule],
  exports: [QuestionDialogComponent],
})
export class QuestionDialogComponentModule {}
