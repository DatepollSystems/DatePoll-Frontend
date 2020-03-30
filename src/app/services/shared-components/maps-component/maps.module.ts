import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';

import {MapsComponentComponent} from './maps.component';

@NgModule({
  declarations: [MapsComponentComponent],
  imports: [CommonModule, MaterialModule, TranslationModule, FormsModule],
  exports: [MapsComponentComponent]
})
export class MapsModule {}
