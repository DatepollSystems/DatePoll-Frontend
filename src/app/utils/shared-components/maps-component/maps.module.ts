import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';

import {MapsComponent} from './maps.component';

@NgModule({
  declarations: [MapsComponent],
  imports: [CommonModule, MaterialModule, TranslationModule, FormsModule],
  exports: [MapsComponent],
})
export class MapsModule {}
