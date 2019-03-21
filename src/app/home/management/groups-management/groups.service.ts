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

  public addSubgroup(subgroup: any) {
    return this.httpService.loggedInV1POSTRequest('/management/subgroups', subgroup, 'addSubgroup');
  }

  public updateSubgroup(subgroup: any, subgroupID: number) {
    return this.httpService.loggedInV1PUTRequest('/management/subgroups/' + subgroupID, subgroup, 'updateSubgroup');
  }

  public deleteSubgroup(subgroupID: number) {
    return this.httpService.loggedInV1DELETERequest('/management/subgroups/' + subgroupID, 'deleteSubgroup');
  }
}
