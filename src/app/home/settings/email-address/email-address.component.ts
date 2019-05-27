import {Component, TemplateRef, ViewChild} from '@angular/core';

import {MyUserService} from '../../my-user.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent {
  @ViewChild('successfullySavedEmailAddresses') successfullySavedEmailAddresses: TemplateRef<any>;

  emailAddresses: string[];

  constructor(
    private _myUserService: MyUserService,
    private notificationsService: NotificationsService) {

    this.emailAddresses = this._myUserService.getEmailAddresses();
  }

  onEmailAddressesChange(emailAddresses: string[]) {
    this.emailAddresses = emailAddresses;
  }

  onSave() {
    this._myUserService.setEmailAddresses(this.emailAddresses).subscribe(
      (response: any) => {
        console.log(response);
        this.notificationsService.html(this.successfullySavedEmailAddresses, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }

}
