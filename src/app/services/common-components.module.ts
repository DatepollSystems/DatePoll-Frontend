import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';

import {CustomDateAdapter, MY_DATE_FORMATS} from './custom-date-adapter';
import {DoNotForgetToSaveComponent} from './shared-components/do-not-forget-to-save/do-not-forget-to-save.component';
import {EmailAddressesListComponent} from '../home/management/users-management/email-addresses-list/email-addresses-list.component';
import {GroupAndSubgroupSelectComponent} from './shared-components/group-and-subgroup-select/group-and-subgroup-select.component';
import {AppDividerComponent} from './shared-components/app-divider/app-divider.component';

@NgModule({
  declarations: [
    AppDividerComponent,
    DoNotForgetToSaveComponent,
    EmailAddressesListComponent,
    GroupAndSubgroupSelectComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
  ],
  exports: [
    AppDividerComponent,
    DoNotForgetToSaveComponent,
    EmailAddressesListComponent,
    GroupAndSubgroupSelectComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})
export class CommonComponentsModule {
}
