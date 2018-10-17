import {Component} from '@angular/core';
import {MzBaseModal, MzToastService} from 'ngx-materialize';
import {PhoneNumber, UserService} from '../../../auth/user.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})
export class PhoneNumberComponent extends MzBaseModal {

  public phoneNumbers: PhoneNumber[];

  constructor(private userService: UserService, private toastService: MzToastService) {
    super();

    this.phoneNumbers = userService.getPhoneNumbers();
  }

  addPhoneNumber(form: NgForm) {
    if (form.value.label === ''
      || form.value.phoneNumber === ''
      || form.value.label === null
      || form.value.phoneNumber === null) {

      this.toastService.show(document.getElementById('notValid').innerText, 4000, 'red');

      return;
    }

    this.phoneNumbers.push(new PhoneNumber(form.value.label, form.value.phoneNumber));

    form.reset();
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
  }

  savePhoneNumbers() {
    this.userService.setPhoneNumbers(this.phoneNumbers);
  }
}
