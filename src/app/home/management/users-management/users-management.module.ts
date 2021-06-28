import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {CommonComponentsModule} from '../../../utils/common-components.module';
import {CustomDateAdapter, MY_DATE_FORMATS} from '../../../utils/custom-date-adapter';
import {GroupAndSubgroupTypeInputSelectModule} from '../../../utils/shared-components/group-and-subgroup-type-input-select/group-and-subgroup-type-input-select.module';
import {UsersManagementRoutingModule} from './users-management-routing.module';
import {ListChipInputModule} from '../../../utils/shared-components/list-chip-input/list-chip-input.module';

import {MatMultiSortModule} from 'ngx-mat-multi-sort';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {BadgesListComponent} from './badges-list/badges-list.component';
import {InstrumentSelectComponent} from './instrument-select/instrument-select.component';
import {PerformanceBadgeSelectComponent} from './performance-badge-select/performance-badge-select.component';
import {PerformanceBadgesListComponent} from './performance-badges-list/performance-badges-list.component';
import {PermissionsListComponent} from './permissions-list/permissions-list.component';
import {PhoneNumbersListComponent} from './phone-numbers-list/phone-numbers-list.component';
import {UserCreateModalComponent} from './user-create-modal/user-create-modal.component';
import {UserUpdateModalComponent} from './user-update-modal/user-update-modal.component';
import {UsersExportBottomSheetComponent, UsersManagementComponent} from './users-management.component';
import {UsersChangesManagementComponent} from './users-changes-management/users-changes-management.component';
import {UserInfoModalComponent} from './user-info-modal/user-info-modal.component';
import {BooleanTranslationModule} from '../../../utils/shared-components/boolean-translation/boolean-translation.module';

@NgModule({
  declarations: [
    UsersManagementComponent,
    UsersExportBottomSheetComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent,
    UserInfoModalComponent,
    PerformanceBadgeSelectComponent,
    InstrumentSelectComponent,
    PerformanceBadgesListComponent,
    PermissionsListComponent,
    PhoneNumbersListComponent,
    BadgesListComponent,
    UsersChangesManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DfxTranslateModule,
    BooleanTranslationModule,
    InfiniteScrollModule,
    NgxMatSelectSearchModule,
    MatMultiSortModule,
    UsersManagementRoutingModule,
    CommonComponentsModule,
    GroupAndSubgroupTypeInputSelectModule,
    ListChipInputModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class UsersManagementModule {}
