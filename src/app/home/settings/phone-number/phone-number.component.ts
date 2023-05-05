import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {MyUserService} from '../../my-user.service';
import {PhoneNumber} from '../../management/users-management/models/phoneNumber.model';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css'],
})
export class PhoneNumberComponent {
  phoneNumbersSubscription: Subscription;
  public phoneNumbers: PhoneNumber[];

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  constructor(private _myUserService: MyUserService) {
    this.phoneNumbers = _myUserService.getPhoneNumbers();
    this.dataSource = new MatTableDataSource(this.phoneNumbers);

    this.phoneNumbersSubscription = this._myUserService.phoneNumberChange.subscribe((value) => {
      this.phoneNumbers = value;
      this.dataSource = new MatTableDataSource(this.phoneNumbers);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addPhoneNumber(form: NgForm) {
    if (form.value.label === '' || form.value.phoneNumber === '' || form.value.label === null || form.value.phoneNumber === null) {
      return;
    }

    const phoneNumberObject = {
      label: form.value.label,
      number: form.value.phoneNumber,
    };

    this._myUserService.addPhoneNumber(phoneNumberObject).subscribe(
      (data: any) => {
        console.log(data);
        const phoneNumber = new PhoneNumber(data.phone_number.id, form.value.label, form.value.phoneNumber);
        this.phoneNumbers.push(phoneNumber);
        this.dataSource = new MatTableDataSource(this.phoneNumbers);
        this._myUserService.setPhoneNumbers(this.phoneNumbers);
        form.reset();
      },
      (error) => console.log(error)
    );
  }

  removePhoneNumber(phoneNumberID: number) {
    this._myUserService.removePhoneNumber(phoneNumberID).subscribe(
      (data: any) => {
        console.log(data);
        this.phoneNumbers = [];

        for (const phoneNumber of this._myUserService.getPhoneNumbers()) {
          if (phoneNumber.id !== phoneNumberID) {
            this.phoneNumbers.push(phoneNumber);
          }
        }
        this._myUserService.setPhoneNumbers(this.phoneNumbers);
        this.dataSource = new MatTableDataSource(this.phoneNumbers);
      },
      (error) => console.log(error)
    );
  }
}
