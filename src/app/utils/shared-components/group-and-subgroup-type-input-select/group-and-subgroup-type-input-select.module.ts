import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {GroupAndSubgroupTypeInputSelectComponent} from './group-and-subgroup-type-input-select.component';

@NgModule({
  declarations: [GroupAndSubgroupTypeInputSelectComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, ReactiveFormsModule],
  exports: [GroupAndSubgroupTypeInputSelectComponent],
})
export class GroupAndSubgroupTypeInputSelectModule {}
