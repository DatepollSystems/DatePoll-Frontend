import { Component } from '@angular/core';
import {MzBaseModal} from 'ngx-materialize';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})
export class PhoneNumberComponent extends MzBaseModal {

  constructor() {
    super();
  }

}
