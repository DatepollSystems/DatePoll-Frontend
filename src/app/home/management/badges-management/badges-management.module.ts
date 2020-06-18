import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {BadgesManagementRoutingModule} from './badges-management-routing.module';

import {BadgesManagementComponent} from './badges-management.component';

@NgModule({
  declarations: [BadgesManagementComponent],
  providers: [],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, BadgesManagementRoutingModule]
})
export class BadgesManagementModule {}
