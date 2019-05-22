import {PhoneNumber} from '../../phoneNumber.model';

export class User {
  public readonly id: number;
  public email: string;
  public email_verified: boolean;
  public force_password_change: boolean;
  public title: string;
  public firstname: string;
  public surname: string;
  public birthday: Date;
  public join_date: Date;
  public streetname: string;
  public streetnumber: string;
  public zipcode: number;
  public location: string;
  public activated: boolean;
  public activity: string;
  private _phoneNumbers: PhoneNumber[] = [];
  private _permissions: string[] = [];

  constructor(id: number, email: string, email_verified: boolean, force_password_change: boolean, title: string,
              firstname: string, surname: string, birthday: Date, join_date: Date, streetname: string, streetnumber: string,
              zipcode: number, location: string, activated: boolean, activity: string, phoneNumbers: PhoneNumber[], permissions: string[]) {
    this.id = id;
    this.email = email;
    this.email_verified = email_verified;
    this.force_password_change = force_password_change;
    this.title = title;
    this.firstname = firstname;
    this.surname = surname;
    this.birthday = birthday;
    this.join_date = join_date;
    this.streetname = streetname;
    this.streetnumber = streetnumber;
    this.zipcode = zipcode;
    this.location = location;
    this.activated = activated;
    this.activity = activity;
    this._phoneNumbers = phoneNumbers;
    this._permissions = permissions;
  }

  public getPhoneNumbers(): PhoneNumber[] {
    return this._phoneNumbers.slice();
  }

  public getPhoneNumbersAsString(): string {
    let phoneNumber = '';
    for (let i = 0; i < this._phoneNumbers.length; i++) {
      phoneNumber += this._phoneNumbers[i].phoneNumber + ', ';
    }

    return phoneNumber;
  }

  public getPermissions(): string[] {
    return this._permissions.slice();
  }
}
