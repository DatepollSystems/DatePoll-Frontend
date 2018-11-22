import {Component} from '@angular/core';
import {MyUserService} from '../../../auth/my-user.service';

@Component({
  selector: 'app-personaldata',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent {
  title: string;
  firstname: string;
  surname: string;

  birthday: Date;

  streetname: string;
  streetnumber: string;
  zipcode: number;
  location: string;

  constructor(private myUserService: MyUserService) {
    this.title = this.myUserService.getTitle();
    this.firstname = this.myUserService.getFirstname();
    this.surname = this.myUserService.getSurname();

    this.birthday = this.myUserService.getBirthday();

    this.streetname = this.myUserService.getStreetname();
    this.streetnumber = this.myUserService.getStreetnumber();
    this.zipcode = this.myUserService.getZipcode();
    this.location = this.myUserService.getLocation();
  }

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

    this.myUserService.setTitle(this.title);
    this.myUserService.setFirstname(this.firstname);
    this.myUserService.setSurname(this.surname);
    this.myUserService.setBirthday(this.birthday);
    this.myUserService.setStreetname(this.streetname);
    this.myUserService.setStreetnumber(this.streetnumber);
    this.myUserService.setZipcode(this.zipcode);
    this.myUserService.setLocation(this.location);

    console.log('Saving...');
    console.log('----------------------');
  }
}
