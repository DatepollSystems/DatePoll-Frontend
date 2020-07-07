import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../utils/http.service';

import {GroupAndSubgroupModel, GroupType} from '../../../utils/models/groupAndSubgroup.model';
import {Group} from './models/group.model';
import {Subgroup} from './models/subgroup.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  public groupsChange: Subject<Group[]> = new Subject<Group[]>();
  public groupsAndSubgroupsChange = new Subject<GroupAndSubgroupModel[]>();
  public groupChange: Subject<any> = new Subject<any>();
  public subgroupChange: Subject<any> = new Subject<any>();
  private _groups: Group[] = [];
  private _groupsAndSubgroups: GroupAndSubgroupModel[] = [];
  private _group: any = null;
  private _subgroup: any = null;

  constructor(private httpService: HttpService) {}

  public setGroups(groups: Group[]) {
    this._groups = groups;
    this.groupsChange.next(this._groups.slice());
  }

  public getGroups(): Group[] {
    this.fetchGroups();
    return this._groups.slice();
  }

  public setGroupsAndSubgroups(groups: GroupAndSubgroupModel[]) {
    this._groupsAndSubgroups = groups;
    this.groupsAndSubgroupsChange.next(this._groupsAndSubgroups.slice());
  }

  public getGroupsAndSubgroups(): GroupAndSubgroupModel[] {
    this.fetchGroups();
    return this._groupsAndSubgroups.slice();
  }

  public fetchGroups() {
    this.httpService.loggedInV1GETRequest('/management/groups', 'fetchGroups').subscribe(
      (data: any) => {
        console.log(data);
        const groupsToStore = [];
        const groupsAndSubgroupsToStore = [];

        for (const groupsData of data.groups) {
          const subgroupsToStore = [];
          for (const subgroupsData of groupsData.subgroups) {
            subgroupsToStore.push(new Subgroup(subgroupsData.id, subgroupsData.name, subgroupsData.description));

            const subgroup = new GroupAndSubgroupModel(subgroupsData.id, subgroupsData.name, GroupType.SUBGROUP);
            subgroup.groupId = groupsData.id;
            subgroup.groupName = groupsData.name;
            groupsAndSubgroupsToStore.push(subgroup);
          }

          groupsToStore.push(new Group(groupsData.id, groupsData.name, groupsData.description, subgroupsToStore));
          groupsAndSubgroupsToStore.push(new GroupAndSubgroupModel(groupsData.id, groupsData.name, GroupType.PARENTGROUP));
        }

        this.setGroups(groupsToStore);
        this.setGroupsAndSubgroups(groupsAndSubgroupsToStore);
      },
      error => console.log(error)
    );
  }

  public addGroup(group: any) {
    return this.httpService.loggedInV1POSTRequest('/management/groups', group, 'addGroup');
  }

  public updateGroup(group: any, groupID: number) {
    return this.httpService.loggedInV1PUTRequest('/management/groups/' + groupID, group, 'updateGroup');
  }

  public deleteGroup(groupID: number) {
    return this.httpService.loggedInV1DELETERequest('/management/groups/' + groupID, 'deleteGroup');
  }

  public addUserToGroup(userID: number, groupID: number, role: string = null) {
    const dto = {
      user_id: userID,
      group_id: groupID,
      role
    };

    return this.httpService.loggedInV1POSTRequest('/management/groups/addUser', dto, 'addUserToGroup');
  }

  public removeUserFromGroup(userID: number, groupID: number) {
    const dto = {
      user_id: userID,
      group_id: groupID
    };

    return this.httpService.loggedInV1POSTRequest('/management/groups/removeUser', dto, 'removeUserFromGroup');
  }

  public updateUserInGroup(userID: number, groupID: number, role: string = null) {
    const dto = {
      user_id: userID,
      group_id: groupID,
      role
    };

    return this.httpService.loggedInV1POSTRequest('/management/groups/updateUser', dto, 'updateUserInGroup');
  }

  public addSubgroup(subgroup: any) {
    return this.httpService.loggedInV1POSTRequest('/management/subgroups', subgroup, 'addSubgroup');
  }

  public updateSubgroup(subgroup: any, subgroupID: number) {
    return this.httpService.loggedInV1PUTRequest('/management/subgroups/' + subgroupID, subgroup, 'updateSubgroup');
  }

  public deleteSubgroup(subgroupID: number) {
    return this.httpService.loggedInV1DELETERequest('/management/subgroups/' + subgroupID, 'deleteSubgroup');
  }

  public addUserToSubgroup(userID: number, subgroupID: number, role: string = null) {
    const dto = {
      user_id: userID,
      subgroup_id: subgroupID,
      role
    };

    return this.httpService.loggedInV1POSTRequest('/management/subgroups/addUser', dto, 'addUserToSubgroup');
  }

  public removeUserFromSubgroup(userID: number, subgroupID: number) {
    const dto = {
      user_id: userID,
      subgroup_id: subgroupID
    };

    return this.httpService.loggedInV1POSTRequest('/management/subgroups/removeUser', dto, 'removeUserFromSubgroup');
  }

  public updateUserInSubgroup(userID: number, subgroupID: number, role: string = null) {
    const dto = {
      user_id: userID,
      subgroup_id: subgroupID,
      role
    };

    return this.httpService.loggedInV1POSTRequest('/management/subgroups/updateUser', dto, 'updateUserInSubgroup');
  }

  public getGroup(groupID: number) {
    this.fetchGroup(groupID);
    return this._group;
  }

  public setGroup(group: any) {
    this._group = group;
    this.groupChange.next(this._group);
  }

  public fetchGroup(groupID: number) {
    this.httpService.loggedInV1GETRequest('/management/groups/' + groupID, 'fetchGroup').subscribe(
      (data: any) => {
        console.log(data);
        this.setGroup(data.group);
      },
      error => console.log(error)
    );
  }

  public getSubgroup(subgroupID: number) {
    this.fetchSubgroup(subgroupID);
    return this._subgroup;
  }

  public setSubgroup(subgroup: any) {
    this._subgroup = subgroup;
    this.subgroupChange.next(this._subgroup);
  }

  public fetchSubgroup(subgroupID: number) {
    this.httpService.loggedInV1GETRequest('/management/subgroups/' + subgroupID, 'fetchSubgroup').subscribe(
      (data: any) => {
        console.log(data);
        this.setSubgroup(data.subgroup);
      },
      error => console.log(error)
    );
  }
}
