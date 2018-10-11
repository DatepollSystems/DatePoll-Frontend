export class UserService {
  private firstname = 'Max';
  private surname = 'Musterboy';
  private email = 'max.musterboy@gmail.com';
  private title = 'Dr.';

  private location = 'Krems';
  private streetname = 'Kasernstraße';
  private streetnumber = '6-12';
  private zipcode = '3500';

  private birthdate = '2000-12-12';
  private joindate = '2000-12-12';

  getFirstname() {
    return this.firstname;
  }

  getSurname() {
    return this.surname;
  }

  getEmail() {
    return this.email;
  }

  getTitle() {
    return this.title;
  }

  getFirstAndSurname() {
    return this.firstname + ' ' + this.surname;
  }

  getCompleteName() {
    return this.title + ' ' + this.firstname + ' ' + this.surname;
  }

  getCompleteLocation() {
    return this.streetname + ' ' + this.streetnumber + ', ' + this.zipcode + ' ' + this.location;
  }

  getJoindate() {
    return this.joindate;
  }

  getBirthdate() {
    return this.birthdate;
  }

  constructor() {}
}
