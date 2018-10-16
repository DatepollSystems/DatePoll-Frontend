import { Component } from '@angular/core';
import {MzBaseModal} from 'ngx-materialize';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent extends MzBaseModal {

  constructor() {
    super();
  }

}
