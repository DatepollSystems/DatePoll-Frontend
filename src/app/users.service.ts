import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }
}

export class User {

  private _ID: number;

  private _title: string;
  private _firstname: string;
  private _surname: string;
  private _email: string;

  private birthday: string;
  private _phoneNumbers: PhoneNumber[];

  constructor() {
    this._phoneNumbers = [];
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
