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

  constructor(private httpService: HttpService) {
    this._users = [];
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
            user.location, user.activated, user.activity, localPhoneNumbers);
          users.push(localUser);
        }
        this.setUsers(users);
      },
      (error) => console.log(error)
    );
  }

  public getUserByID(userID: number): User {
    const users = this.getUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userID) {
        return users[i];
      }
    }

    return null;
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
}
