import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {UsersManagementRoutingModule} from './users-management-routing.module';

import {UsersExportBottomSheetComponent, UsersManagementComponent} from './users-management.component';
import {UserCreateModalComponent} from './user-create-modal/user-create-modal.component';
import {UserUpdateModalComponent} from './user-update-modal/user-update-modal.component';
import {PerformanceBadgeSelectComponent} from './performance-badge-select/performance-badge-select.component';
import {InstrumentSelectComponent} from './instrument-select/instrument-select.component';
import {CommonComponentsModule} from '../../../services/common-components.module';
import { AppDividerComponent } from './app-divider/app-divider.component';
import {DateAdapter} from '@angular/material';
import {CustomDateAdapter} from '../../../services/custom-date-adapter';

@NgModule({
  declarations: [
    UsersManagementComponent,
    UsersExportBottomSheetComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent,
    PerformanceBadgeSelectComponent,
    InstrumentSelectComponent,
    AppDividerComponent
  ],
  entryComponents: [
    UsersExportBottomSheetComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    NgxMatSelectSearchModule,
    UsersManagementRoutingModule,
    CommonComponentsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class UsersManagementModule {
}
