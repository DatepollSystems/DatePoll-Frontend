import { Component } from '@angular/core';
import {MzBaseModal} from 'ngx-materialize';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent extends MzBaseModal {

  constructor() {
    super();
  }

}
