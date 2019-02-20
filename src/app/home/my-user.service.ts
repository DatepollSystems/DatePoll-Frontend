import {Subject} from 'rxjs';
import {Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpService} from '../services/http.service';
import {Permissions} from '../permissions';
import {PhoneNumber} from './phoneNumber.model';

@Injectable({
  providedIn: 'root'
})
export class MyUserService {
  private _ID: number;

  private _title: string;

  private _firstname: string;
  public firstnameChange: Subject<string> = new Subject<string>();

  private _surname: string;
  public surnameChange: Subject<string> = new Subject<string>();

  private _email: string;
  public emailChange: Subject<string> = new Subject<string>();

  private _streetname: string;
  private _streetnumber: string;
  private _zipcode: number;
  private _location: string;

  private _birthday: Date;
  private _joindate: Date;

  private _phoneNumbers = [];
  public phoneNumberChange: Subject<PhoneNumber[]> = new Subject<PhoneNumber[]>();

  private _permissions: string[];
  public permissionsChange: Subject<string[]> = new Subject<string[]>();

  constructor(private authService: AuthService, private httpService: HttpService) {
    this.fetchMyself();
  }

  fetchMyself() {
    this.httpService.loggedInV1GETRequest('/user/myself', 'fetchMyself').subscribe(
      (dataComplete: any) => {
        const data = dataComplete.user;
        this.setID(data.id);
        this.setTitle(data.title);
        this.setFirstname(data.firstname);
        this.setSurname(data.surname);
        this.setEmail(data.email);
        this.setStreetname(data.streetname);
        this.setStreetnumber(data.streetnumber);
        this.setZipcode(data.zipcode);
        this.setLocation(data.location);
        this.setBirthday(data.birthday);
        this.setJoindate(data.join_date);
        this.setPermissions(data.permissions);

        const localPhoneNumbers = [];
        const localPhoneNumbersData = data.telephoneNumbers;
        for (let i = 0; i < localPhoneNumbersData.length; i++) {
          localPhoneNumbers.push(
            new PhoneNumber(localPhoneNumbersData[i].id, this.getID(), localPhoneNumbersData[i].label, localPhoneNumbersData[i].number));
        }
        this.setPhoneNumbers(localPhoneNumbers);
      },
      (error) => console.log(error)
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
      'title': this.getTitle(),
      'firstname': this.getFirstname(),
      'surname': this.getSurname(),
      'streetname': this.getStreetname(),
      'streetnumber': this.getStreetnumber(),
      'zipcode': this.getZipcode(),
      'location': this.getLocation(),
      'birthday': dateformat
    };

    this.httpService.loggedInV1PUTRequest('/user/myself', userObject, 'updateMyself').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
      },
      (error) => console.log(error)
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

  setEmail(email: string) {
    this._email = email;
    this.emailChange.next(this._email);
  }

  getEmail(): string {
    return this._email;
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
      return true;
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