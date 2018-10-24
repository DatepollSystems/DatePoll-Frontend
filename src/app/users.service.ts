import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _users: User[];

  constructor() {
    this._users = [];

    // for (let i = 2; i < 10; i++) {
    //   this._users.push(new User(i, '', 'Bob' + i, 'Super' + i, i + 'boy@gmail.com', '2018-12-3'));
    // }
  }

  getUsers() {
    return this._users;
  }
}

export class User {

  private _ID: number;

  private _title: string;
  private _firstname: string;
  private _surname: string;
  private _email: string;

  private _birthday: string;
  private _phoneNumbers: PhoneNumber[];

  constructor(ID: number, title: string, firstname: string, surname: string, email: string, birthday: string) {
    this._ID = ID;

    this._title = title;
    this._firstname = firstname;
    this._surname = surname;
    this._email = email;
    this._birthday = birthday;

    this._phoneNumbers = [];
  }

  getTitle(): string {
    return this._title;
  }

  getFirstname(): string {
    return this._firstname;
  }

  getSurname(): string {
    return this._surname;
  }

  getEmail(): string {
    return this._email;
  }

  getBirthday(): string {
    return this._birthday;
  }

}

export class PhoneNumber {
  private readonly label: string;
  private readonly phoneNumber: string;

  constructor(label: string, phoneNumber: string) {
    this.label = label;
    this.phoneNumber = phoneNumber;
  }

  public getLabel() {
    return this.label;
  }

  public getPhoneNumber() {
    return this.phoneNumber;
  }
}
