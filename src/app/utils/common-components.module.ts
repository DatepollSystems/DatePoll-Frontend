import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {MaterialModule} from '../material-module';
import {DfxTranslateModule} from 'dfx-translate';

import {CustomDateAdapter, MY_DATE_FORMATS} from './custom-date-adapter';

import {EmailAddressesListComponent} from '../home/management/users-management/email-addresses-list/email-addresses-list.component';
import {AppDividerComponent} from './shared-components/app-divider/app-divider.component';
import {DoNotForgetToSaveComponent} from './shared-components/do-not-forget-to-save/do-not-forget-to-save.component';
import {ListChipInputModule} from './shared-components/list-chip-input/list-chip-input.module';

@NgModule({
  declarations: [AppDividerComponent, DoNotForgetToSaveComponent, EmailAddressesListComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule, FormsModule, ListChipInputModule],
  exports: [AppDividerComponent, DoNotForgetToSaveComponent, EmailAddressesListComponent],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class CommonComponentsModule {}
