import {PhoneNumber} from '../../phoneNumber.model';

export class User {
  private readonly _id: number;
  private _email: string;
  private _email_verified: boolean;
  private _force_password_change: boolean;
  private _title: string;
  private _firstname: string;
  private _surname: string;
  private _birthday: Date;
  private _join_date: Date;
  private _streetname: string;
  private _streetnumber: string;
  private _zipcode: number;
  private _location: string;
  private _phoneNumbers: PhoneNumber[] = [];

  constructor(id: number, email: string, email_verified: boolean, force_password_change: boolean, title: string,
              firstname: string, surname: string, birthday: Date, join_date: Date, streetname: string, streetnumber: string,
              zipcode: number, location: string, phoneNumbers: PhoneNumber[]) {
    this._id = id;
    this._email = email;
    this._email_verified = email_verified;
    this._force_password_change = force_password_change;
    this._title = title;
    this._firstname = firstname;
    this._surname = surname;
    this._birthday = birthday;
    this._join_date = join_date;
    this._streetname = streetname;
    this._streetnumber = streetnumber;
    this._zipcode = zipcode;
    this._location = location;
    this._phoneNumbers = phoneNumbers;
  }

  public getID(): number {
    return this._id;
  }

  public getEmail(): string {
    return this._email;
  }

  public setEmail(email: string) {
    this._email = email;
  }

  public getEmailVerified(): boolean {
    return this._email_verified;
  }

  public setEmailVerified(email_verified: boolean) {
    this._email_verified = email_verified;
  }

  public getForcePasswordChange(): boolean {
    return this._force_password_change;
  }

  public setForcePasswordChange(force_password_change: boolean) {
    this._force_password_change = force_password_change;
  }

  public getTitle(): string {
    return this._title;
  }

  public setTitle(title: string) {
    this._title = title;
  }

  public getFirstname(): string {
    return this._firstname;
  }

  public setFirstname(firstname: string) {
    this._firstname = firstname;
  }

  public getSurname(): string {
    return this._surname;
  }

  public setSurname(surname: string) {
    this._surname = surname;
  }

  public getBirthday(): Date {
    return this._birthday;
  }

  public setBirthday(birthday: Date) {
    this._birthday = birthday;
  }

  public getJoinDate(): Date {
    return this._join_date;
  }

  public setJoinDate(join_date: Date) {
    this._join_date = join_date;
  }

  public getStreetname(): string {
    return this._streetname;
  }

  public setStreetname(streetname: string) {
    this._streetname = streetname;
  }

  public getStreetnumber(): string {
    return this._streetnumber;
  }

  public setStreetnumber(streetnumber: string) {
    this._streetnumber = streetnumber;
  }

  public getZipcode(): number {
    return this._zipcode;
  }

  public setZipcode(zipcode: number) {
    this._zipcode = zipcode;
  }

  public getLocation(): string {
    return this._location;
  }

  public setLocation(location: string) {
    this._location = location;
  }

  public getPhoneNumbers(): PhoneNumber[] {
    return this._phoneNumbers.slice();
  }

  public getPhoneNumbersAsString(): string {
    let phoneNumber = '';
    for (let i = 0; i < this._phoneNumbers.length; i++) {
      phoneNumber += this._phoneNumbers[i].getPhoneNumber() + ', ';
    }

    return phoneNumber;
  }

  public setPhoneNumbers(phoneNumbers: PhoneNumber[]) {
    this._phoneNumbers = phoneNumbers;
  }
}
