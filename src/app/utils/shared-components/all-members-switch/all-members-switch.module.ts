import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';

import {AllMembersSwitchComponent} from './all-members-switch.component';

@NgModule({
  declarations: [AllMembersSwitchComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule],
  exports: [AllMembersSwitchComponent],
})
export class AllMembersSwitchModule {}
