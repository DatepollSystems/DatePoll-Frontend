import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';

import {AllMembersSwitchComponent} from './all-members-switch.component';

@NgModule({
  declarations: [AllMembersSwitchComponent],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule],
  exports: [AllMembersSwitchComponent]
})
export class AllMembersSwitchModule {}
