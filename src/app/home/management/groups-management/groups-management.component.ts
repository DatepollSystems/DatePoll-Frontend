import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';

import {MyUserService} from '../../my-user.service';
import {GroupsService} from './groups.service';

import {GroupCreateModalComponent} from './group-create-modal/group-create-modal.component';
import {GroupDeleteModalComponent} from './group-delete-modal/group-delete-modal.component';
import {GroupUpdateModalComponent} from './group-update-modal/group-update-modal.component';
import {GroupUserListModalComponent} from './group-user-list-modal/group-user-list-modal.component';
import {SubgroupCreateModalComponent} from './subgroup-create-modal/subgroup-create-modal.component';
import {SubgroupDeleteModalComponent} from './subgroup-delete-modal/subgroup-delete-modal.component';
import {SubgroupUpdateModalComponent} from './subgroup-update-modal/subgroup-update-modal.component';
import {SubgroupUserListModalComponent} from './subgroup-user-list-modal/subgroup-user-list-modal.component';

import {Group} from './models/group.model';
import {Subgroup} from './models/subgroup.model';

@Component({
  selector: 'app-groups-management',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.css'],
})
export class GroupsManagementComponent implements OnDestroy {
  groupsLoaded = true;

  groups: Group[];
  groupsSubscription: Subscription;

  sortedGroups: Group[];

  constructor(
    private router: Router,
    private myUserService: MyUserService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private groupsService: GroupsService
  ) {
    this.groupsLoaded = false;

    this.groups = this.groupsService.getGroups();
    this.sortedGroups = this.groups;

    if (this.groups.length > 0) {
      this.groupsLoaded = true;
    }

    this.groupsSubscription = this.groupsService.groupsChange.subscribe((value) => {
      this.groupsLoaded = true;

      this.groups = value;
      this.sortedGroups = this.groups;
    });
  }

  ngOnDestroy() {
    this.groupsSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.sortedGroups = [];

    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].name.toLowerCase().includes(filterValue.toLowerCase())) {
        this.sortedGroups.push(this.groups[i]);
      } else {
        for (let j = 0; j < this.groups[i].getSubgroups().length; j++) {
          if (this.groups[i].getSubgroups()[j].name.toLowerCase().includes(filterValue.toLowerCase())) {
            this.sortedGroups.push(this.groups[i]);
            break;
          }
        }
      }
    }
  }

  refreshGroups() {
    this.groupsLoaded = false;
    this.groups = [];
    this.sortedGroups = this.groups;
    this.groupsService.fetchGroups();
  }

  onCreateGroup() {
    this.dialog.open(GroupCreateModalComponent, {
      width: '80vh',
    });
  }

  onUpdateGroup(group: Group) {
    this.dialog.open(GroupUpdateModalComponent, {
      width: '80vh',
      data: {group},
    });
  }

  onDeleteGroup(groupID: number) {
    this.bottomSheet.open(GroupDeleteModalComponent, {
      data: {groupID: groupID},
    });
  }

  onInfoGroup(groupID: number) {
    this.dialog.open(GroupUserListModalComponent, {
      width: '80vh',
      data: {groupID},
    });
  }

  onCreateSubgroup(groupID: number) {
    this.dialog.open(SubgroupCreateModalComponent, {
      width: '80vh',
      data: {groupID},
    });
  }

  onUpdateSubgroup(groupID: number, subgroup: Subgroup) {
    this.dialog.open(SubgroupUpdateModalComponent, {
      width: '80vh',
      data: {groupID, subgroup},
    });
  }

  onDeleteSubgroup(subgroupID: number) {
    this.bottomSheet.open(SubgroupDeleteModalComponent, {
      data: {subgroupID: subgroupID},
    });
  }

  onInfoSubgroup(subgroupID: number) {
    this.dialog.open(SubgroupUserListModalComponent, {
      width: '80vh',
      data: {subgroupID},
    });
  }

  trackByFn(inde, item) {
    return item.id;
  }
}
