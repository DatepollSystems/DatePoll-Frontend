import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-email-addresses-list',
  templateUrl: './email-addresses-list.component.html',
  styleUrls: ['./email-addresses-list.component.css']
})
export class EmailAddressesListComponent implements OnInit {

  displayedColumns: string[] = ['emailAddress', 'action'];
  dataSource: MatTableDataSource<string>;

  emailAddresses: string[] = [];

  @Input() emailAddressesInput: string[];
  @Output() emailAddressesChanged = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    if (this.emailAddressesInput != null) {
      this.emailAddresses = this.emailAddressesInput;
      this.dataSource = new MatTableDataSource(this.emailAddresses);
    }
  }

  addEmailAddress(form: NgForm) {
    const emailAddress = form.controls.emailAddress.value;
    this.emailAddresses.push(emailAddress);
    this.dataSource = new MatTableDataSource(this.emailAddresses);

    form.reset();
    this.emailAddressesChanged.emit(this.emailAddresses);
  }

  removeEmailAddress(emailAddress: string) {
    const localEmailAddresses = [];
    for (let i = 0; i < this.emailAddresses.length; i++) {
      if (!this.emailAddresses[i].includes(emailAddress)) {
        localEmailAddresses.push(this.emailAddresses[i]);
      }
    }
    this.emailAddresses = localEmailAddresses;
    this.dataSource = new MatTableDataSource(this.emailAddresses);
    this.emailAddressesChanged.emit(this.emailAddresses);
  }

}
