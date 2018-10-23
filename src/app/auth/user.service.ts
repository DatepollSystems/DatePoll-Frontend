import {Subject} from 'rxjs';

export class UserService {

  constructor() {
    this._phoneNumbers = [];

    this._phoneNumbers.push(new PhoneNumber('Home', '+43 664 2567390'));
    this._phoneNumbers.push(new PhoneNumber('Work', '+43 664 5925905'));
    this._phoneNumbers.push(new PhoneNumber('Private', '+43 664 7590367'));
  }

  private _title = 'Dr.';
  private _firstname = 'Max';
  private _surname = 'Musterboy';
  private _email = 'max.musterboy@gmail.com';

  private _streetname = 'Kasernstraße';
  private _streetnumber = '6-12';
  private _zipcode = 3500;
  private _location = 'Krems';

  private _birthday = '2000-12-24';
  private _joindate = '2000-12-24';

  private _phoneNumbers: PhoneNumber[];

  public firstnameChange: Subject<string> = new Subject<string>();
  public surnameChange: Subject<string> = new Subject<string>();
  public emailChange: Subject<string> = new Subject<string>();

  setTitle(title: string) {
    this._title = title;
  }

  getTitle(): string {
    return this._title;
  }

  setFirstname(firstname: string) {
    this._firstname = firstname;
    this.firstnameChange.next(this._firstname);
  }

  getFirstname(): string {
    return this._firstname;
  }

  setSurname(surname: string) {
    this._surname = surname;
    this.surnameChange.next(this._surname);
  }

  getSurname(): string {
    return this._surname;
  }

  setEmail(email: string) {
    this._email = email;
    this.emailChange.next(this._email);
  }

  getEmail(): string {
    return this._email;
  }

  setBirthday(birthday: string) {
    this._birthday = birthday;
  }

  getBirthday(): string {
    return this._birthday;
  }

  setStreetname(streetname: string) {
    this._streetname = streetname;
  }

  getStreetname(): string {
    return this._streetname;
  }

  setStreetnumber(streetnumber: string) {
    this._streetnumber = streetnumber;
  }

  getStreetnumber(): string {
    return this._streetnumber;
  }

  setZipcode(zipcode: number) {
    this._zipcode = zipcode;
  }

  getZipcode(): number {
    return this._zipcode;
  }

  setLocation(location: string) {
    this._location = location;
  }

  getLocation(): string {
    return this._location;
  }

  getJoindate(): string {
    return this._joindate;
  }

  setPhoneNumbers(phoneNumbers: any) {
    this._phoneNumbers = phoneNumbers;
  }

  getPhoneNumbers() {
    return this._phoneNumbers;
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
