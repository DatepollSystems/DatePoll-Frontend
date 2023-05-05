import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxPrintModule} from 'ngx-print';

import {MaterialModule} from '../../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {DeletedUsersManagementRoutingModule} from './deleted-users-management-routing.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../../utils/custom-date-adapter';

import {DeletedUsersManagementComponent} from './deleted-users-management.component';

@NgModule({
  declarations: [DeletedUsersManagementComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, NgxPrintModule, DeletedUsersManagementRoutingModule],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class DeletedUsersManagementModule {}
