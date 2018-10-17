import { Component } from '@angular/core';
import {MzBaseModal, MzToastService} from 'ngx-materialize';
import {UserService} from '../../../auth/user.service';

@Component({
  selector: 'app-personaldata',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent extends MzBaseModal {
  title: string;
  firstname: string;
  surname: string;

  birthday: string;

  streetname: string;
  streetnumber: string;
  zipcode: number;
  location: string;

  constructor(private userService: UserService, private toastService: MzToastService) {
    super();

    this.title = this.userService.getTitle();
    this.firstname = this.userService.getFirstname();
    this.surname = this.userService.getSurname();

    this.birthday = this.userService.getBirthday();

    this.streetname = this.userService.getStreetname();
    this.streetnumber = this.userService.getStreetnumber();
    this.zipcode = this.userService.getZipcode();
    this.location = this.userService.getLocation();
  }

  public datepickerOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
    close: 'Ok',    // Ok button text
    today: 'Today', // Today button text
    closeOnClear: false,
    closeOnSelect: false,
    format: 'dddd, dd mmm, yyyy', // Visible date format (defaulted to formatSubmit if provided otherwise 'd mmmm, yyyy')
    formatSubmit: 'yyyy-mm-dd',   // Return value format (used to set/get value)
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 200,    // Creates a dropdown of 10 years to control year,
  };

  saveData() {
    console.log('----------------------');
    console.log('Title: ' + this.title);
    console.log('Firstname: ' + this.firstname);
    console.log('Surname: ' + this.surname);
    console.log('Birthday: ' + this.birthday);
    console.log('Streetname: ' + this.streetname);
    console.log('Streetnumber: ' + this.streetnumber);
    console.log('Zipcode: ' + this.zipcode);
    console.log('Location: ' + this.location);

    this.userService.setTitle(this.title);
    this.userService.setFirstname(this.firstname);
    this.userService.setSurname(this.surname);
    this.userService.setBirthday(this.birthday);
    this.userService.setStreetname(this.streetname);
    this.userService.setStreetnumber(this.streetnumber);
    this.userService.setZipcode(this.zipcode);
    this.userService.setLocation(this.location);

    console.log('Saving...');
    console.log('----------------------');
 }
}
