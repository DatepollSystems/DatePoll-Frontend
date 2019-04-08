import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

import {Subscription} from 'rxjs';

import {GroupsService} from './groups.service';
import {MyUserService} from '../../my-user.service';

import {GroupCreateModalComponent} from './group-create-modal/group-create-modal.component';
import {GroupUpdateModalComponent} from './group-update-modal/group-update-modal.component';
import {SubgroupCreateModalComponent} from './subgroup-create-modal/subgroup-create-modal.component';
import {SubgroupUpdateModalComponent} from './subgroup-update-modal/subgroup-update-modal.component';

import {Group} from './group.model';
import {Subgroup} from './subgroup.model';
import {Permissions} from '../../../permissions';

@Component({
  selector: 'app-groups-management',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.css']
})
export class GroupsManagementComponent implements OnInit, OnDestroy {
  groupsLoaded = true;

  groups: Group[];
  groupsSubscription: Subscription;

  sortedGroups: Group[];

  private permissionSubscription: Subscription;

  constructor(
    private router: Router,
    private myUserService: MyUserService,
    private dialog: MatDialog,
    private groupsService: GroupsService) {

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });

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

  ngOnInit() {
    if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy() {
    this.permissionSubscription.unsubscribe();
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
      width: '80vh'
    });
  }

  onUpdateGroup(group: Group) {
    this.dialog.open(GroupUpdateModalComponent, {
      width: '80vh',
      data: {group: group}
    });
  }

  onDeleteGroup(groupID: number) {
    this.groupsService.deleteGroup(groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }

  onCreateSubgroup(groupID: number) {
    this.dialog.open(SubgroupCreateModalComponent, {
      width: '80vh',
      data: {groupID: groupID}
    });
  }

  onUpdateSubgroup(groupID: number, subgroup: Subgroup) {
    this.dialog.open(SubgroupUpdateModalComponent, {
      width: '80vh',
      data: {groupID: groupID, subgroup: subgroup}
    });
  }

  onDeleteSubgroup(subgroupID: number) {
    this.groupsService.deleteSubgroup(subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }

}
