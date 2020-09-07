import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../utils/http.service';

import {GroupAndSubgroupModel, GroupType} from '../../../utils/models/groupAndSubgroup.model';
import {PhoneNumber} from '../../phoneNumber.model';
import {DeletedUser} from './deletedUser.model';
import {User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public usersChange: Subject<User[]> = new Subject<User[]>();
  public deletedUserChange: Subject<DeletedUser[]> = new Subject<DeletedUser[]>();
  public joinedGroupsChange: Subject<any[]> = new Subject<any[]>();
  public freeGroupsChange: Subject<any[]> = new Subject<any[]>();
  private _users: User[];
  private _deletedUsers: DeletedUser[] = [];
  private _joinedGroups: GroupAndSubgroupModel[];
  private _freeGroups: GroupAndSubgroupModel[];

  constructor(private httpService: HttpService) {
    this._users = [];
    this._joinedGroups = [];
    this._freeGroups = [];
  }

  public getUsersWithoutFetch(): User[] {
    return this._users.slice();
  }

  public getUsers(): User[] {
    this.fetchUsers();
    return this._users.slice();
  }

  public setUsers(users: User[]) {
    this._users = users;
    this.usersChange.next(this._users.slice());
  }

  public fetchUsers() {
    this.httpService.loggedInV1GETRequest('/management/users', 'fetchUsers').subscribe(
      (data: any) => {
        console.log(data);
        const fetchedUsers = data.users;

        const users = [];
        for (const user of fetchedUsers) {
          const localUser = this.fetchUserCreateLocalUser(user);
          users.push(localUser);
        }
        this.setUsers(users);
      },
      error => console.log(error)
    );
  }

  public fetchUserCreateLocalUser(user: any) {
    const localPhoneNumbers = [];
    for (const localPhoneNumberData of user.phone_numbers) {
      localPhoneNumbers.push(new PhoneNumber(localPhoneNumberData.id, localPhoneNumberData.label, localPhoneNumberData.number));
    }

    const birthday = new Date(user.birthday);
    const join_date = new Date(user.join_date);

    return new User(
      user.id,
      user.username,
      user.email_addresses,
      user.force_password_change,
      user.title,
      user.firstname,
      user.surname,
      birthday,
      join_date,
      user.streetname,
      user.streetnumber,
      user.zipcode,
      user.location,
      user.activated,
      user.activity,
      user.member_number,
      user.internal_comment,
      user.information_denied,
      user.bv_member,
      localPhoneNumbers,
      user.permissions
    );
  }

  public addUser(user: any) {
    return this.httpService.loggedInV1POSTRequest('/management/users', user, 'addUser');
  }

  public deleteUser(userID: number) {
    return this.httpService.loggedInV1DELETERequest('/management/users/' + userID, 'deleteUser');
  }

  public updateUser(userID: number, user: any) {
    return this.httpService.loggedInV1PUTRequest('/management/users/' + userID, user, 'updateUser');
  }

  public changePasswordForUser(userID: number, password: string) {
    const dto = {
      password
    };
    return this.httpService.loggedInV1PUTRequest('/management/users/changePassword/' + userID, dto, 'changePasswordFromUser');
  }

  public getJoinedOfUser(userID: number): GroupAndSubgroupModel[] {
    this.fetchJoinedOfUser(userID);
    return this._joinedGroups.slice();
  }

  public fetchJoinedOfUser(userID: number) {
    this.httpService.loggedInV1GETRequest('/management/groups/joined/' + userID, 'fetchJoinedGroupsOfUser').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];
        for (const groupDTO of data.groups) {
          const group = new GroupAndSubgroupModel(groupDTO.id, groupDTO.name, GroupType.PARENTGROUP);
          groups.push(group);
        }

        this.httpService.loggedInV1GETRequest('/management/subgroups/joined/' + userID, 'fetchJoinedSubgroupsOfUser').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            for (const subgroupDTO of subgroupData.subgroups) {
              const subgroup = new GroupAndSubgroupModel(subgroupDTO.id, subgroupDTO.name, GroupType.SUBGROUP);
              subgroup.groupId = subgroupDTO.group_id;
              subgroup.groupName = subgroupDTO.group_name;
              groups.push(subgroup);
            }

            this.setJoinedOfUser(groups);
          },
          error => console.log(error)
        );
      },
      error => console.log(error)
    );
  }

  public getFreeOfUser(userID: number): GroupAndSubgroupModel[] {
    this.fetchFreeOfUser(userID);
    return this._freeGroups.slice();
  }

  public setFreeOfUser(groups: GroupAndSubgroupModel[]) {
    this._freeGroups = groups;
    this.freeGroupsChange.next(this._freeGroups.slice());
  }

  public fetchFreeOfUser(userID: number) {
    this.httpService.loggedInV1GETRequest('/management/groups/free/' + userID, 'fetchFreeGroupsOfUser').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];
        for (const groupDTO of data.groups) {
          const group = new GroupAndSubgroupModel(groupDTO.id, groupDTO.name, GroupType.PARENTGROUP);
          groups.push(group);
        }

        this.httpService.loggedInV1GETRequest('/management/subgroups/free/' + userID, 'fetchFreeSubgroupsOfUser').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            for (const subgroupDTO of subgroupData.subgroups) {
              const subgroup = new GroupAndSubgroupModel(subgroupDTO.id, subgroupDTO.name, GroupType.SUBGROUP);
              subgroup.groupId = subgroupDTO.group_id;
              subgroup.groupName = subgroupDTO.group_name;
              groups.push(subgroup);
            }

            this.setFreeOfUser(groups);
          },
          error => console.log(error)
        );
      },
      error => console.log(error)
    );
  }

  public export() {
    return this.httpService.loggedInV1GETRequest('/management/export/users');
  }

  public activateAll() {
    return this.httpService.loggedInV1POSTRequest('/management/users/activate', {}, 'activateAll');
  }

  private setJoinedOfUser(groups: GroupAndSubgroupModel[]) {
    this._joinedGroups = groups;
    this.joinedGroupsChange.next(this._joinedGroups.slice());
  }

  public getDeletedUsers(): DeletedUser[] {
    this.fetchDeletedUsers();
    return this._deletedUsers.slice();
  }

  private fetchDeletedUsers() {
    this.httpService.loggedInV1GETRequest('/management/deleted/users', 'getDeletedUsers').subscribe(
      (response: any) => {
        console.log(response);
        const users = [];
        for (const user of response.users) {
          users.push(new DeletedUser(user.id, user.firstname, user.surname, user.join_date, user.internal_comment, user.created_at));
        }
        this.setDeletedUsers(users);
      },
      error => console.log(error)
    );
  }

  public setDeletedUsers(deletedUsers: DeletedUser[]) {
    this._deletedUsers = deletedUsers;
    this.deletedUserChange.next(this._deletedUsers.slice());
  }

  public deleteAllDeletedUsers() {
    return this.httpService.loggedInV1DELETERequest('/management/deleted/users', 'deleteAllDeletedUsers');
  }
}
