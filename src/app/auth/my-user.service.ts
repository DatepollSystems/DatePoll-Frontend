import {Subject} from 'rxjs';
import {PhoneNumber} from '../users.service';

export class MyUserService {
  private _ID: number;

  private _title: string;
  private _firstname: string;
  private _surname: string;
  private _email: string;

  private _streetname: string;
  private _streetnumber: string;
  private _zipcode: number;
  private _location: string;

  private _birthday: string;
  private _joindate: string;

  private _phoneNumbers: PhoneNumber[];

  public firstnameChange: Subject<string> = new Subject<string>();
  public surnameChange: Subject<string> = new Subject<string>();
  public emailChange: Subject<string> = new Subject<string>();

  constructor() {
    this._phoneNumbers = [];

    this.setID(1);
    this.setTitle('Dr.');
    this.setFirstname('Max');
    this.setSurname('Musterboy');
    this.setEmail('max.musterboy@gmail.com');
    this.setStreetname('Kasernstraße');
    this.setStreetnumber('6-12');
    this.setZipcode(3500);
    this.setLocation('Krems');
    this.setBirthday('2000-12-24');
    this.setJoindate('2000-12-24');

    this._phoneNumbers.push(new PhoneNumber('Home', '+43 664 2567390'));
    this._phoneNumbers.push(new PhoneNumber('Work', '+43 664 5925905'));
    this._phoneNumbers.push(new PhoneNumber('Private', '+43 664 7590367'));
  }

  setID(ID: number) {
    this._ID = ID;
  }

  getID(): number {
    return this._ID;
  }

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

  setJoindate(joindate: string) {
    this._joindate = joindate;
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
