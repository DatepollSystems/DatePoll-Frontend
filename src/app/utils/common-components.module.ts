import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from './custom-date-adapter';

import {EmailAddressesListComponent} from '../home/management/users-management/email-addresses-list/email-addresses-list.component';
import {AppDividerComponent} from './shared-components/app-divider/app-divider.component';
import {DoNotForgetToSaveComponent} from './shared-components/do-not-forget-to-save/do-not-forget-to-save.component';
import {GroupAndSubgroupSelectComponent} from './shared-components/group-and-subgroup-select/group-and-subgroup-select.component';

@NgModule({
  declarations: [AppDividerComponent, DoNotForgetToSaveComponent, EmailAddressesListComponent, GroupAndSubgroupSelectComponent],
  imports: [CommonModule, MaterialModule, TranslationModule, FormsModule],
  exports: [AppDividerComponent, DoNotForgetToSaveComponent, EmailAddressesListComponent, GroupAndSubgroupSelectComponent],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class CommonComponentsModule {}