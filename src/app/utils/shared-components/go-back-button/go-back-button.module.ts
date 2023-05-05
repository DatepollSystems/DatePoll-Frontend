import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {GoBackButtonComponent} from './go-back-button.component';

@NgModule({
  declarations: [GoBackButtonComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule],
  exports: [GoBackButtonComponent],
})
export class GoBackButtonModule {}
