import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../services/http.service';

import {Group} from './group.model';
import {Subgroup} from './subgroup.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private _groups: Group[] = [];
  public groupsChange: Subject<Group[]> = new Subject<Group[]>();

  private _group: any = null;
  public groupChange: Subject<any> = new Subject<any>();

  private _subgroup: any = null;
  public subgroupChange: Subject<any> = new Subject<any>();

  constructor(private httpService: HttpService) {
  }

  public setGroups(groups: Group[]) {
    this._groups = groups;
    this.groupsChange.next(this._groups.slice());
  }

  public getGroups(): Group[] {
    this.fetchGroups();
    return this._groups.slice();
  }

  public fetchGroups() {
    this.httpService.loggedInV1GETRequest('/management/groups', 'fetchGroups').subscribe(
      (data: any) => {
        console.log(data);
        const groupsToStore = [];

        const groupsData = data.groups;
        for (let i = 0; i < groupsData.length; i++) {
          const subgroupsToStore = [];
          for (let j = 0; j < groupsData[i].subgroups.length; j++) {
            subgroupsToStore.push(new Subgroup(groupsData[i].subgroups[j].id, groupsData[i].subgroups[j].name,
              groupsData[i].subgroups[j].description));
          }

          groupsToStore.push(new Group(groupsData[i].id, groupsData[i].name, groupsData[i].description, subgroupsToStore));
        }

        this.setGroups(groupsToStore);
      },
      (error) => console.log(error)
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
      'user_id': userID,
      'group_id': groupID,
      'role': role
    };

    return this.httpService.loggedInV1POSTRequest('/management/groups/addUser', dto, 'addUserToGroup');
  }

  public removeUserFromGroup(userID: number, groupID: number) {
    const dto = {
      'user_id': userID,
      'group_id': groupID
    };

    return this.httpService.loggedInV1POSTRequest('/management/groups/removeUser', dto, 'removeUserFromGroup');
  }

  public updateUserInGroup(userID: number, groupID: number, role: string = null) {
    const dto = {
      'user_id': userID,
      'group_id': groupID,
      'role': role
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
      'user_id': userID,
      'subgroup_id': subgroupID,
      'role': role
    };

    return this.httpService.loggedInV1POSTRequest('/management/subgroups/addUser', dto, 'addUserToSubgroup');
  }

  public removeUserFromSubgroup(userID: number, subgroupID: number) {
    const dto = {
      'user_id': userID,
      'subgroup_id': subgroupID
    };

    return this.httpService.loggedInV1POSTRequest('/management/subgroups/removeUser', dto, 'removeUserFromSubgroup');
  }

  public updateUserInSubgroup(userID: number, subgroupID: number, role: string = null) {
    const dto = {
      'user_id': userID,
      'subgroup_id': subgroupID,
      'role': role
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
      (error) => console.log(error)
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
      (error) => console.log(error)
    );
  }
}
