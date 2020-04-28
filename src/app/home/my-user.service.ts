import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {HttpService} from '../utils/http.service';
import {Permissions} from '../permissions';
import {PhoneNumber} from './phoneNumber.model';

@Injectable({
  providedIn: 'root'
})
export class MyUserService {
  public firstnameChange: Subject<string> = new Subject<string>();
  public surnameChange: Subject<string> = new Subject<string>();
  public usernameChange: Subject<string> = new Subject<string>();
  public phoneNumberChange: Subject<PhoneNumber[]> = new Subject<PhoneNumber[]>();
  public permissionsChange: Subject<string[]> = new Subject<string[]>();
  public emailAddressesChange: Subject<string[]> = new Subject<string[]>();
  private _ID: number;
  private _title: string;
  private _firstname: string;
  private _surname: string;
  private _username: string;
  private _emailAddresses: string[] = [];
  private _streetname: string;
  private _streetnumber: string;
  private _zipcode: number;
  private _location: string;
  private _birthday: Date;
  private _joindate: Date;
  private _phoneNumbers = [];
  private _permissions: string[];

  constructor(private authService: AuthService, private httpService: HttpService) {
    this.fetchMyself();
  }

  fetchMyself() {
    this.httpService.loggedInV1GETRequest('/user/myself', 'fetchMyself').subscribe(
      (dataComplete: any) => {
        console.log(dataComplete);

        const data = dataComplete.user;
        this.setID(data.id);
        this.setTitle(data.title);
        this.setFirstname(data.firstname);
        this.setSurname(data.surname);
        this.setUsername(data.username);
        this.setEmailAddresses(data.email_addresses);
        this.setStreetname(data.streetname);
        this.setStreetnumber(data.streetnumber);
        this.setZipcode(data.zipcode);
        this.setLocation(data.location);
        this.setBirthday(data.birthday);
        this.setJoindate(data.join_date);
        this.setPermissions(data.permissions);

        const localPhoneNumbers = [];
        const localPhoneNumbersData = data.phone_numbers;
        for (let i = 0; i < localPhoneNumbersData.length; i++) {
          localPhoneNumbers.push(
            new PhoneNumber(localPhoneNumbersData[i].id, localPhoneNumbersData[i].label, localPhoneNumbersData[i].number)
          );
        }
        this.setPhoneNumbers(localPhoneNumbers);
      },
      error => console.log(error)
    );
  }

  updateMyself() {
    const d = new Date(this.getBirthday());
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const dateformat = [year, month, day].join('-');

    const userObject = {
      title: this.getTitle(),
      firstname: this.getFirstname(),
      surname: this.getSurname(),
      streetname: this.getStreetname(),
      streetnumber: this.getStreetnumber(),
      zipcode: this.getZipcode(),
      location: this.getLocation(),
      birthday: dateformat
    };

    this.httpService.loggedInV1PUTRequest('/user/myself', userObject, 'updateMyself').subscribe(
      (data: any) => {
        console.log(data);
      },
      error => console.log(error)
    );
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

  setUsername(username: string) {
    this._username = username;
    this.usernameChange.next(this._username);
  }

  getUsername(): string {
    return this._username;
  }

  setBirthday(birthday: Date) {
    this._birthday = birthday;
  }

  getBirthday(): Date {
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

  setJoindate(joindate: Date) {
    this._joindate = joindate;
  }

  getJoindate(): Date {
    return this._joindate;
  }

  public setEmailAddresses(emailAddresses: string[]) {
    this._emailAddresses = emailAddresses;
    this.emailAddressesChange.next(this._emailAddresses.slice());
  }

  public setEmailAddressesPerRequest(emailAddresses: string[]) {
    const request = {
      email_addresses: this._emailAddresses
    };
    return this.httpService.loggedInV1POSTRequest('/user/myself/changeEmailAddresses', request, 'updateEmailAddresses');
  }

  public getEmailAddresses(): string[] {
    return this._emailAddresses.slice();
  }

  public addPhoneNumber(phoneNumberObject: any) {
    return this.httpService.loggedInV1POSTRequest('/user/myself/phoneNumber', phoneNumberObject, 'addPhoneNumber');
  }

  public removePhoneNumber(phoneNumberID: number) {
    return this.httpService.loggedInV1DELETERequest('/user/myself/phoneNumber/' + phoneNumberID, 'removePhoneNumber');
  }

  setPhoneNumbers(phoneNumbers: PhoneNumber[]) {
    this._phoneNumbers = phoneNumbers;
    this.phoneNumberChange.next(this._phoneNumbers);
  }

  getPhoneNumbers(): PhoneNumber[] {
    return this._phoneNumbers.slice();
  }

  getPermissions(): string[] {
    if (this._permissions == null) {
      return null;
    }
    return this._permissions.slice();
  }

  setPermissions(permissions: string[]) {
    this._permissions = permissions;
    this.permissionsChange.next(this._permissions);
  }

  hasPermission(permission: string) {
    if (this.getPermissions() === null) {
      return false;
    }

    for (let i = 0; i < this.getPermissions().length; i++) {
      if (this.getPermissions()[i] === Permissions.ROOT_ADMINISTRATION) {
        return true;
      }

      if (this.getPermissions()[i] === permission) {
        return true;
      }
    }
    return false;
  }
}
