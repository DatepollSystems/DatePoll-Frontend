import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-email-addresses-list',
  templateUrl: './email-addresses-list.component.html',
  styleUrls: ['./email-addresses-list.component.css'],
})
export class EmailAddressesListComponent {
  @Input() emailAddresses: string[];
  @Output() emailAddressesChanged = new EventEmitter();

  constructor() {}

  onEmailAddressChange(emailAddresses: string[]) {
    this.emailAddresses = emailAddresses.slice();
    this.emailAddressesChanged.emit(this.emailAddresses);
  }
}
