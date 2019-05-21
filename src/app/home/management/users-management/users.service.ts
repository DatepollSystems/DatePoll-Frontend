import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../services/http.service';
import {PhoneNumber} from '../../phoneNumber.model';
import {User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _users: User[];
  public usersChange: Subject<User[]> = new Subject<User[]>();

  private _joinedGroups: any[];
  public joinedGroupsChange: Subject<any[]> = new Subject<any[]>();

  private _freeGroups: any[];
  public freeGroupsChange: Subject<any[]> = new Subject<any[]>();

  constructor(private httpService: HttpService) {
    this._users = [];
    this._joinedGroups = [];
    this._freeGroups = [];
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
        const fetchedUsers = data.users;

        const users = [];
        for (const user of fetchedUsers) {
          const localPhoneNumbers = [];
          const localPhoneNumbersData = user.phoneNumbers;
          for (let i = 0; i < localPhoneNumbersData.length; i++) {
            localPhoneNumbers.push(new PhoneNumber(localPhoneNumbersData[i].id, localPhoneNumbersData[i].label,
              localPhoneNumbersData[i].number));
          }

          const birthday = new Date(user.birthday);
          const join_date = new Date(user.join_date);

          const localUser = new User(user.id, user.email, user.email_verified, user.force_password_change, user.title,
            user.firstname, user.surname, birthday, join_date, user.streetname, user.streetnumber, user.zipcode,
            user.location, user.activated, user.activity, localPhoneNumbers, user.permissions);
          users.push(localUser);
        }
        this.setUsers(users);
      },
      (error) => console.log(error)
    );
  }

  public addUser(user: any) {
    return this.httpService.loggedInV1POSTRequest('/management/users', user, 'addUser');
  }

  public deleteUser(userID: number) {
    this.httpService.loggedInV1DELETERequest('/management/users/' + userID, 'deleteUser').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchUsers();
      }
    );
  }

  public updateUser(userID: number, user: any) {
    return this.httpService.loggedInV1PUTRequest('/management/users/' + userID, user, 'updateUser');
  }


  public getJoinedOfUser(userID: number): any[] {
    this.fetchJoinedOfUser(userID);
    return this._joinedGroups.slice();
  }

  public setJoinedOfUser(groups: any[]) {
    this._joinedGroups = groups;
    this.joinedGroupsChange.next(this._joinedGroups.slice());
  }

  public fetchJoinedOfUser(userID: number) {
    this.httpService.loggedInV1GETRequest('/management/groups/joined/' + userID, 'fetchJoinedGroupsOfUser').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];

        const groupsDTO = data.groups;
        for (let i = 0; i < groupsDTO.length; i++) {
          const groupDTO = groupsDTO[i];

          const groupObject = {
            'id': groupDTO.id,
            'name': groupDTO.name,
            'type': 'parentgroup'
          };

          groups.push(groupObject);
        }

        this.httpService.loggedInV1GETRequest('/management/subgroups/joined/' + userID, 'fetchJoinedSubgroupsOfUser').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            const subgroupsDTO = subgroupData.subgroups;
            for (let i = 0; i < subgroupsDTO.length; i++) {
              const subgroupDTO = subgroupsDTO[i];

              const subgroupObject = {
                'id': subgroupDTO.id,
                'name': subgroupDTO.name,
                'type': 'subgroup',
                'group_id': subgroupDTO.group_id,
                'group_name': subgroupDTO.group_name
              };

              groups.push(subgroupObject);
            }

            this.setJoinedOfUser(groups);
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }


  public getFreeOfUser(userID: number): any[] {
    this.fetchFreeOfUser(userID);
    return this._freeGroups.slice();
  }

  public setFreeOfUser(groups: any[]) {
    this._freeGroups = groups;
    this.freeGroupsChange.next(this._freeGroups.slice());
  }

  public fetchFreeOfUser(userID: number) {
    this.httpService.loggedInV1GETRequest('/management/groups/free/' + userID, 'fetchFreeGroupsOfUser').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];

        const groupsDTO = data.groups;
        for (let i = 0; i < groupsDTO.length; i++) {
          const groupDTO = groupsDTO[i];

          const groupObject = {
            'id': groupDTO.id,
            'name': groupDTO.name,
            'type': 'parentgroup'
          };

          groups.push(groupObject);
        }

        this.httpService.loggedInV1GETRequest('/management/subgroups/free/' + userID, 'fetchFreeSubgroupsOfUser').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            const subgroupsDTO = subgroupData.subgroups;
            for (let i = 0; i < subgroupsDTO.length; i++) {
              const subgroupDTO = subgroupsDTO[i];

              const subgroupObject = {
                'id': subgroupDTO.id,
                'name': subgroupDTO.name,
                'type': 'subgroup',
                'group_id': subgroupDTO.group_id,
                'group_name': subgroupDTO.group_name
              };

              groups.push(subgroupObject);
            }

            this.setFreeOfUser(groups);
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }


  public export() {
    return this.httpService.loggedInV1GETRequest('/management/export/users');
  }

  public activateAll() {
    return this.httpService.loggedInV1POSTRequest('/management/users/activate', {}, 'activateAll');
  }
}
