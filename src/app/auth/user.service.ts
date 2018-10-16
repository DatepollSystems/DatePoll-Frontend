import {Subject} from 'rxjs';

export class UserService {

  constructor() {}

  private title = 'Dr.';
  private firstname = 'Max';
  private surname = 'Musterboy';
  private email = 'max.musterboy@gmail.com';

  private streetname = 'Kasernstraße';
  private streetnumber = '6-12';
  private zipcode = '3500';
  private location = 'Krems';

  private birthday = '2000-12-24';
  private joindate = '2000-12-24';

  firstnameChange: Subject<string> = new Subject<string>();
  surnameChange: Subject<string> = new Subject<string>();
  emailChange: Subject<string> = new Subject<string>();

  setTitle(title: string) {
    this.title = title;
  }
  getTitle() {
    return this.title;
  }

  setFirstname(firstname: string) {
    this.firstname = firstname;
    this.firstnameChange.next(this.firstname);
  }
  getFirstname() {
    return this.firstname;
  }

  setSurname(surname: string) {
    this.surname = surname;
    this.surnameChange.next(this.surname);
  }
  getSurname() {
    return this.surname;
  }

  setEmail(email: string) {
    this.email = email;
    this.emailChange.next(this.email);
  }
  getEmail() {
    return this.email;
  }

  setBirthday(birthday: string) {
    this.birthday = birthday;
  }
  getBirthday() {
    return this.birthday;
  }

  setStreetname(streetname: string) {
    this.streetname = streetname;
  }
  getStreetname() {
    return this.streetname;
  }

  setStreetnumber(streetnumber: string) {
    this.streetnumber = streetnumber;
  }
  getStreetnumber() {
    return this.streetnumber;
  }

  setZipcode(zipcode: string) {
    this.zipcode = zipcode;
  }
  getZipcode() {
    return this.zipcode;
  }

  setLocation(location: string) {
    this.location = location;
  }
  getLocation() {
    return this.location;
  }

  getJoindate() {
    return this.joindate;
  }
}
