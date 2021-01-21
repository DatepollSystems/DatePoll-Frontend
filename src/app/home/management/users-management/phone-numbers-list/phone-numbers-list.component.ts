import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

import {PhoneNumber} from '../../../phoneNumber.model';

@Component({
  selector: 'app-phone-numbers-list',
  templateUrl: './phone-numbers-list.component.html',
  styleUrls: ['./phone-numbers-list.component.css'],
})
export class PhoneNumbersListComponent implements OnInit {
  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  @Input() phoneNumbers: PhoneNumber[] = [];

  @Output() phoneNumbersChanged = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
  }

  addPhoneNumber(form: NgForm) {
    this.phoneNumbers.push(new PhoneNumber(Math.random(), form.value.label, form.value.phoneNumber));
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    form.reset();
    this.phoneNumbersChanged.emit(this.phoneNumbers.slice());
  }

  removePhoneNumber(number: PhoneNumber) {
    const i = this.phoneNumbers.indexOf(number);
    this.phoneNumbers.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    this.phoneNumbersChanged.emit(this.phoneNumbers.slice());
  }
}
