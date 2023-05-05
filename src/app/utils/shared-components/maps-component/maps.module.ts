import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';

import {MapsComponent} from './maps.component';

@NgModule({
  declarations: [MapsComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule, FormsModule],
  exports: [MapsComponent],
})
export class MapsModule {}
