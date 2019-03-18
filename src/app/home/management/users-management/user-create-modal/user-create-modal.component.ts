import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {UsersService} from '../users.service';
import {PhoneNumber} from '../../../phoneNumber.model';
import {MatDialogRef, MatTableDataSource} from '@angular/material';
import {Response} from '@angular/http';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.css']
})
export class UserCreateModalComponent implements OnInit {

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  sendingRequest = false;

  birthday: Date;
  join_date: Date;
  phoneNumberCount = 0;
  phoneNumbers: PhoneNumber[] = [];

  constructor(private usersService: UsersService, private dialogRef: MatDialogRef<UserCreateModalComponent>) {
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
  }

  ngOnInit() {
  }

  addPhoneNumber(form: NgForm) {
    this.phoneNumbers.push(new PhoneNumber(this.phoneNumberCount, form.value.label, form.value.phoneNumber));
    this.phoneNumberCount++;
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    form.reset();
  }

  removePhoneNumber(id: number) {
    const localPhoneNumbers = [];
    for (let i = 0; i < this.phoneNumbers.length; i++) {
      if (this.phoneNumbers[i].id !== id) {
        localPhoneNumbers.push(this.phoneNumbers[i]);
      }
    }

    this.phoneNumbers = localPhoneNumbers;
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
  }

  create(form: NgForm) {
    const title = form.controls.title.value;
    const email = form.controls.email.value;
    const firstname = form.controls.firstname.value;
    const surname = form.controls.surname.value;
    const streetname = form.controls.streetname.value;
    const streetnumber = form.controls.streetnumber.value;
    const zipcode = form.controls.zipcode.value;
    const location = form.controls.location.value;
    const activity = form.controls.activity.value;
    let activated = form.controls.activated.value;

    if (activated.toString().length === 0) {
      activated = false;
    }

    let d = new Date(this.birthday);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const birthdayformatted = [year, month, day].join('-');

    d = new Date(this.join_date);
    month = '' + (d.getMonth() + 1);
    day = '' + d.getDate();
    year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const join_dateformatted = [year, month, day].join('-');

    console.log('create User | title: ' + title);
    console.log('create User | email: ' + email);
    console.log('create User | firstname: ' + firstname);
    console.log('create User | surname: ' + surname);
    console.log('create User | birthday: ' + birthdayformatted);
    console.log('create User | join_date: ' + join_dateformatted);
    console.log('create User | streetname: ' + streetname);
    console.log('create User | streetnumber: ' + streetnumber);
    console.log('create User | zipcode: ' + zipcode);
    console.log('create User | location: ' + location);
    console.log('create User | activity: ' + activity);
    console.log('create User | activated: ' + activated);

    const phoneNumbersObject = [];

    for (let i = 0; i < this.phoneNumbers.length; i++) {
      const phoneNumberObject = {
        'label': this.phoneNumbers[i].label,
        'number': this.phoneNumbers[i].phoneNumber
      };
      phoneNumbersObject.push(phoneNumberObject);
    }

    const userObject = {
      'title': title,
      'email': email,
      'firstname': firstname,
      'surname': surname,
      'birthday': birthdayformatted,
      'join_date': join_dateformatted,
      'streetname': streetname,
      'streetnumber': streetnumber,
      'zipcode': zipcode,
      'location': location,
      'activated': activated,
      'activity': activity,
      'phoneNumbers': phoneNumbersObject
    };
    console.log(userObject);

    form.controls.title.disable();
    form.controls.email.disable();
    form.controls.firstname.disable();
    form.controls.surname.disable();
    form.controls.streetname.disable();
    form.controls.streetnumber.disable();
    form.controls.zipcode.disable();
    form.controls.location.disable();
    form.controls.activity.disable();
    form.controls.activated.disable();
    document.getElementById('datepicker-birthday').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-birthday-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-join_date').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-join_date-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('addPhoneNumber-button').setAttribute('disabled', 'disabled');
    document.getElementById('phoneNumber').setAttribute('disabled', 'disabled');
    document.getElementById('label').setAttribute('disabled', 'disabled');

    this.sendingRequest = true;

    this.usersService.addUser(userObject).subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.usersService.fetchUsers();
        this.dialogRef.close();
      },
      (error) => {
        console.log(error);
        this.usersService.fetchUsers();
        this.dialogRef.close();
      }
    );
  }

}
