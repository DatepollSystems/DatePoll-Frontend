import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {NotificationsService, NotificationType} from 'angular2-notifications';
import {MyUserService} from '../../my-user.service';
import {UserSettingsService} from '../privacy-settings/userSettings.service';

import {EmailAddressesListComponent} from '../../management/users-management/email-addresses-list/email-addresses-list.component';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent implements OnDestroy {
  @ViewChild('successfullySavedEmailAddresses', {static: true}) successfullySavedEmailAddresses: TemplateRef<any>;
  @ViewChild('emailList', {static: true}) emailAddressesList: EmailAddressesListComponent;

  emailAddresses: string[];
  emailAddressesSubscription: Subscription;

  public notifyViaEmailOnNewEvent = true;
  private notifyViaEmailOnNewEventSubscription: Subscription;

  constructor(
    private _myUserService: MyUserService,
    private notificationsService: NotificationsService,
    private settingsService: UserSettingsService
  ) {
    this.emailAddresses = this._myUserService.getEmailAddresses();

    this.emailAddressesSubscription = this._myUserService.emailAddressesChange.subscribe(value => {
      this.emailAddresses = value;
      this.emailAddressesList.setEmailAddressesInTable(this.emailAddresses);
    });

    this.notifyViaEmailOnNewEvent = this.settingsService.getNotifyMeOnNewEventViaEmail();
    this.notifyViaEmailOnNewEventSubscription = this.settingsService.notifyMeOnNewEventViaEmailChange.subscribe(value => {
      this.notifyViaEmailOnNewEvent = value;
    });
  }

  onEmailAddressesChange(emailAddresses: string[]) {
    this.emailAddresses = emailAddresses;
  }

  onSave() {
    this._myUserService.setEmailAddressesPerRequest(this.emailAddresses).subscribe(
      (response: any) => {
        console.log(response);
        this._myUserService.setEmailAddresses(this.emailAddresses);
        this.notificationsService.html(this.successfullySavedEmailAddresses, NotificationType.Success, null, 'success');
      },
      error => console.log(error)
    );
  }

  ngOnDestroy(): void {
    this.emailAddressesSubscription.unsubscribe();
    this.notifyViaEmailOnNewEventSubscription.unsubscribe();
  }

  notifyMeOnNewEventChange(ob: MatSlideToggleChange) {
    this.settingsService.setNotifyMeOnNewEventViaEmail(ob.checked, true);
  }
}
