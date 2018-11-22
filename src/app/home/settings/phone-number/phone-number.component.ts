import {Component, OnInit, ViewChild} from '@angular/core';
import {MyUserService} from '../../../auth/my-user.service';
import {NgForm} from '@angular/forms';
import {PhoneNumber} from '../../../users.service';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})
export class PhoneNumberComponent {

  public phoneNumbers: PhoneNumber[];

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  constructor(private _myUserService: MyUserService) {
    this.phoneNumbers = _myUserService.getPhoneNumbers();
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addPhoneNumber(form: NgForm) {
    if (form.value.label === ''
      || form.value.phoneNumber === ''
      || form.value.label === null
      || form.value.phoneNumber === null) {

      return;
    }

    this.phoneNumbers.push(new PhoneNumber(form.value.label, form.value.phoneNumber));
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    form.reset();

    console.log('Telephone number added!');

    this._myUserService.setPhoneNumbers(this.phoneNumbers);
    console.log('All phone numbers saved!');
  }

  removePhoneNumber(phoneNumber: PhoneNumber) {
    let index;

    for (let i = 0; i < this.phoneNumbers.length; i++) {
      if (this.phoneNumbers[i].getPhoneNumber() === phoneNumber.getPhoneNumber()
        && this.phoneNumbers[i].getLabel() === phoneNumber.getLabel()) {
        index = i;
      }
    }

    this.phoneNumbers.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.phoneNumbers);

    console.log('Telephone number removed!');

    this._myUserService.setPhoneNumbers(this.phoneNumbers);
    console.log('All phone numbers saved!');
  }
}
