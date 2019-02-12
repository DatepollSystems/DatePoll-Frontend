import {Subject} from 'rxjs';
import {Headers, Http, Response} from '@angular/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyUserService {
  apiUrl = environment.apiUrl;

  private _ID: number;

  private _title: string;
  private _firstname: string;
  private _surname: string;
  private _email: string;

  private _streetname: string;
  private _streetnumber: string;
  private _zipcode: number;
  private _location: string;

  private _birthday: Date;
  private _joindate: Date;

  private _phoneNumbers: PhoneNumber[];

  public firstnameChange: Subject<string> = new Subject<string>();
  public surnameChange: Subject<string> = new Subject<string>();
  public emailChange: Subject<string> = new Subject<string>();

  constructor(private http: Http, private authService: AuthService) {
    this.fetchMyself();
    this._phoneNumbers = [];

    this._phoneNumbers.push(new PhoneNumber('Home', '+43 664 2567390'));
    this._phoneNumbers.push(new PhoneNumber('Work', '+43 664 5925905'));
    this._phoneNumbers.push(new PhoneNumber('Private', '+43 664 7590367'));
  }

  fetchMyself() {
    if (this.authService.isAutenticated('fetchMyself')) {
      const token = this.authService.getToken('fetchMyself');

      this.http.get(this.apiUrl + '/v1/user/myself?token=' + token).pipe(map(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          return data;
        }
      )).subscribe(
        (dataComplete: any) => {
          const data = dataComplete.user
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
        },
        (error) => console.log(error)
      );
    }
  }

  updateMyself() {
    const token = this.authService.getToken('updateMyself');
    const headers = new Headers({'Content-Type': 'application/json'});

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

    this.http.put(this.apiUrl + '/v1/user/myself?token=' + token, userObject, {headers: headers}).subscribe(
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
