import {PhoneNumber} from '../../phoneNumber.model';

export class User {
  public readonly id: number;
  public username: string;
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
  public memberNumber: number;
  public internalComment: string;
  public informationDenied: boolean;
  public bvMember: boolean;
  private _phoneNumbers: PhoneNumber[] = [];
  private _permissions: string[] = [];
  private readonly _emailAddresses: string[] = [];

  constructor(
    id: number,
    username: string,
    emailAddresses: string[],
    force_password_change: boolean,
    title: string,
    firstname: string,
    surname: string,
    birthday: Date,
    join_date: Date,
    streetname: string,
    streetnumber: string,
    zipcode: number,
    location: string,
    activated: boolean,
    activity: string,
    memberNumber: number,
    internalComent: string,
    informationDenied: boolean,
    bvMember: boolean,
    phoneNumbers: PhoneNumber[],
    permissions: string[]
  ) {
    this.id = id;
    this.username = username;
    this._emailAddresses = emailAddresses;
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
    this.memberNumber = memberNumber;
    this.internalComment = internalComent;
    this.informationDenied = informationDenied;
    this.bvMember = bvMember;
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

    if (phoneNumber !== '') {
      return phoneNumber.slice(0, 10) + '...';
    } else {
      return phoneNumber;
    }
  }

  public getPermissions(): string[] {
    return this._permissions.slice();
  }

  public getEmailAddresses(): string[] {
    return this._emailAddresses.slice();
  }

  public getEmailAddressesAsString(): string {
    let email = '';
    for (let i = 0; i < this._emailAddresses.length; i++) {
      email += this._emailAddresses[i] + ', ';
    }

    if (email !== '') {
      return email.slice(0, 10) + '...';
    } else {
      return email;
    }
  }
}
