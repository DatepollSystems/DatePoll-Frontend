import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {GoBackButtonComponent} from './go-back-button.component';

@NgModule({
  declarations: [GoBackButtonComponent],
  imports: [CommonModule, MaterialModule, TranslationModule],
  exports: [GoBackButtonComponent]
})
export class GoBackButtonModule {}
