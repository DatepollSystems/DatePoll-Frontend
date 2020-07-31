import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgxPrintModule} from 'ngx-print';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {GroupsManagementRoutingModule} from './groups-management-routing.module';

import {GroupsService} from './groups.service';

import {GroupCreateModalComponent} from './group-create-modal/group-create-modal.component';
import {GroupDeleteModalComponent} from './group-delete-modal/group-delete-modal.component';
import {GroupUpdateModalComponent} from './group-update-modal/group-update-modal.component';
import {GroupUserListModalComponent} from './group-user-list-modal/group-user-list-modal.component';
import {GroupUserRoleUpdateModalComponent} from './group-user-list-modal/group-user-role-update-modal/group-user-role-update-modal.component';
import {GroupsManagementComponent} from './groups-management.component';
import {SubgroupCreateModalComponent} from './subgroup-create-modal/subgroup-create-modal.component';
import {SubgroupDeleteModalComponent} from './subgroup-delete-modal/subgroup-delete-modal.component';
import {SubgroupUpdateModalComponent} from './subgroup-update-modal/subgroup-update-modal.component';
import {SubgroupUserListModalComponent} from './subgroup-user-list-modal/subgroup-user-list-modal.component';
import {SubgroupUserRoleUpdateModalComponent} from './subgroup-user-list-modal/subgroup-user-role-update-modal/subgroup-user-role-update-modal.component';

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
    SubgroupDeleteModalComponent
  ],
  providers: [GroupsService],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, NgxPrintModule, GroupsManagementRoutingModule]
})
export class GroupsManagementModule {}
