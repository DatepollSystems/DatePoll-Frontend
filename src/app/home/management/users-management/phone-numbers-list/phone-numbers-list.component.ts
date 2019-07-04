import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PhoneNumber} from '../../../phoneNumber.model';
import {NgForm} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-phone-numbers-list',
  templateUrl: './phone-numbers-list.component.html',
  styleUrls: ['./phone-numbers-list.component.css']
})
export class PhoneNumbersListComponent implements OnInit {

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  @Input() phoneNumbers: PhoneNumber[] = [];

  @Output() phoneNumbersChanged = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
  }

  addPhoneNumber(form: NgForm) {
    this.phoneNumbers.push(new PhoneNumber(Math.random(), form.value.label, form.value.phoneNumber));
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    form.reset();
    this.phoneNumbersChanged.emit(this.phoneNumbers.slice());
  }

  removePhoneNumber(number: string) {
    const localPhoneNumbers = [];
    for (let i = 0; i < this.phoneNumbers.length; i++) {
      if (this.phoneNumbers[i].phoneNumber !== number) {
        localPhoneNumbers.push(this.phoneNumbers[i]);
      }
    }

    this.phoneNumbers = localPhoneNumbers;
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    this.phoneNumbersChanged.emit(this.phoneNumbers.slice());
  }

}
