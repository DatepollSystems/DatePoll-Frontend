import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';

import {DateAdapter} from '@angular/material';
import {CommonComponentsModule} from '../../../services/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../services/custom-date-adapter';
import {InstrumentSelectComponent} from './instrument-select/instrument-select.component';
import {PerformanceBadgeSelectComponent} from './performance-badge-select/performance-badge-select.component';
import {PerformanceBadgesListComponent} from './performance-badges-list/performance-badges-list.component';
import {PermissionsListComponent} from './permissions-list/permissions-list.component';
import {PhoneNumbersListComponent} from './phone-numbers-list/phone-numbers-list.component';
import {UserCreateModalComponent} from './user-create-modal/user-create-modal.component';
import {UserDeleteModalComponent} from './user-delete-modal/user-delete-modal.component';
import {UserUpdateModalComponent} from './user-update-modal/user-update-modal.component';
import {UsersManagementRoutingModule} from './users-management-routing.module';
import {UsersExportBottomSheetComponent, UsersManagementComponent} from './users-management.component';

@NgModule({
  declarations: [
    UsersManagementComponent,
    UsersExportBottomSheetComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent,
    PerformanceBadgeSelectComponent,
    InstrumentSelectComponent,
    PerformanceBadgesListComponent,
    PermissionsListComponent,
    PhoneNumbersListComponent,
    UserDeleteModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
    NgxMatSelectSearchModule,
    UsersManagementRoutingModule,
    CommonComponentsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class UsersManagementModule {}
