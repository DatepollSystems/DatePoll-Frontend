import { Component } from '@angular/core';
import {MzBaseModal} from 'ngx-materialize';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent extends MzBaseModal {

  constructor() {
    super();
  }

}
