import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {GroupsManagementRoutingModule} from './groups-management-routing.module';

import {GroupsManagementComponent} from './groups-management.component';
import {GroupCreateModalComponent} from './group-create-modal/group-create-modal.component';
import {GroupUpdateModalComponent} from './group-update-modal/group-update-modal.component';
import {SubgroupUpdateModalComponent} from './subgroup-update-modal/subgroup-update-modal.component';
import {SubgroupCreateModalComponent} from './subgroup-create-modal/subgroup-create-modal.component';
import {GroupUserListModalComponent} from './group-user-list-modal/group-user-list-modal.component';
import {SubgroupUserListModalComponent} from './subgroup-user-list-modal/subgroup-user-list-modal.component';
import {GroupUserRoleUpdateModalComponent} from './group-user-list-modal/group-user-role-update-modal/group-user-role-update-modal.component';
import {SubgroupUserRoleUpdateModalComponent} from './subgroup-user-list-modal/subgroup-user-role-update-modal/subgroup-user-role-update-modal.component';
import {GroupDeleteModalComponent} from './group-delete-modal/group-delete-modal.component';
import {SubgroupDeleteModalComponent} from './subgroup-delete-modal/subgroup-delete-modal.component';

@NgModule({
  declarations: [
    GroupsManagementComponent,
    GroupCreateModalComponent,
    GroupUpdateModalComponent,
    SubgroupUpdateModalComponent,
    SubgroupCreateModalComponent,
    GroupUserListModalComponent,
    SubgroupUserListModalComponent,
    GroupUserRoleUpdateModalComponent,
    SubgroupUserRoleUpdateModalComponent,
    GroupDeleteModalComponent,
    SubgroupDeleteModalComponent,
  ],
  entryComponents: [
    GroupCreateModalComponent,
    GroupUpdateModalComponent,
    SubgroupUpdateModalComponent,
    SubgroupCreateModalComponent,
    GroupUserListModalComponent,
    SubgroupUserListModalComponent,
    GroupUserRoleUpdateModalComponent,
    SubgroupUserRoleUpdateModalComponent,
    GroupDeleteModalComponent,
    SubgroupDeleteModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    GroupsManagementRoutingModule
  ]
})
export class GroupsManagementModule {
}
