import { Injectable } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {User} from './user.model';
import {Subject} from 'rxjs';
import {PhoneNumber} from '../phoneNumber.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _lastFetchedUsers: Date = null;
  private _users: User[];
  public usersChange: Subject<User[]> = new Subject<User[]>();

  constructor(private httpService: HttpService) {
    this._users = [];
  }

  public getUsers(): User[] {
    this.checkAndFetchUsers();
    return this._users.slice();
  }

  public setUsers(users: User[]) {
    this._users = users;
    this.usersChange.next(this._users.slice());
  }

  public checkAndFetchUsers(force: boolean = false) {
    let fetchUsers = false;

    if (this._lastFetchedUsers === null) {
      fetchUsers = true;
      this._lastFetchedUsers = new Date();
      console.log('fetchUsers | Set date: ' + this._lastFetchedUsers.getTime());
    } else {
      const delta = (new Date().getTime() - this._lastFetchedUsers.getTime()) / 1000;
      if (delta > 60) {
        fetchUsers = true;
        this._lastFetchedUsers = new Date();
        console.log('fetchUsers | Reset date, new date: ' + this._lastFetchedUsers.getTime());
      } else {
        console.log('fetchUsers | Seconds since last fetch: ' + delta);
      }
    }

    if (fetchUsers || force) {
      this.httpService.loggedInV1GETRequest('/management/users', 'fetchUsers').subscribe(
        (data: any) => {
          const fetchedUsers = data.users;

          const users = [];
          for (const user of fetchedUsers) {
            const localPhoneNumbers = [];
            const localPhoneNumbersData = user.telephoneNumbers;
            for (let i = 0; i < localPhoneNumbersData.length; i++) {
              localPhoneNumbers.push(new PhoneNumber(localPhoneNumbersData[i].id, user.id, localPhoneNumbersData[i].label, localPhoneNumbersData[i].number));
            }

            const birthday = new Date(user.birthday);
            const join_date = new Date(user.join_date);

            const localUser = new User(user.id, user.email, user.email_verified, user.force_password_change, user.title,
              user.firstname, user.surname, birthday, join_date, user.streetname, user.streetnumber, user.zipcode,
              user.location, localPhoneNumbers);
            users.push(localUser);
          }
          this.setUsers(users);
        },
        (error) => console.log(error)
      );
    }
  }

  public getUserByID(userID: number): User {
    const users = this.getUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].getID() === userID) {
        return users[i];
      }
    }

    return null;
  }

  public addUser(user: User) {

  }

  public deleteUser(userID: number) {

  }

  public updateUser(userID: number, user: User) {

  }
}
