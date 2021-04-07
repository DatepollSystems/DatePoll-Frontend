import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {NotificationsService, NotificationType} from 'angular2-notifications';
import {TranslateService} from '../../../translation/translate.service';
import {MyUserService} from '../../my-user.service';
import {UserSettingsService} from '../privacy-settings/userSettings.service';

import {EmailAddressesListComponent} from '../../management/users-management/email-addresses-list/email-addresses-list.component';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css'],
})
export class EmailAddressComponent implements OnDestroy {
  @ViewChild('emailList', {static: true}) emailAddressesList: EmailAddressesListComponent;

  emailAddresses: string[];
  emailAddressesSubscription: Subscription;

  public notifyViaEmailOnNewEvent = true;
  private notifyViaEmailOnNewEventSubscription: Subscription;

  public notifyMeViaEmailOnBroadcast = true;
  private notifyMeViaEmailOnBroadcastSubscription: Subscription;

  constructor(
    private _myUserService: MyUserService,
    private notificationsService: NotificationsService,
    private settingsService: UserSettingsService,
    private translate: TranslateService,
    private dialog: MatDialogRef<EmailAddressComponent>
  ) {
    this.emailAddresses = this._myUserService.getEmailAddresses();

    this.emailAddressesSubscription = this._myUserService.emailAddressesChange.subscribe((value) => {
      this.emailAddresses = value;
    });

    this.notifyViaEmailOnNewEvent = this.settingsService.getNotifyMeOnNewEventViaEmail();
    this.notifyViaEmailOnNewEventSubscription = this.settingsService.notifyMeOnNewEventViaEmailChange.subscribe((value) => {
      this.notifyViaEmailOnNewEvent = value;
    });

    this.notifyMeViaEmailOnBroadcast = this.settingsService.getNotifyMeViaEmailOnBroadcast();
    this.notifyMeViaEmailOnBroadcastSubscription = this.settingsService.notifyMeViaEmailOnBroadcastChange.subscribe((value) => {
      this.notifyMeViaEmailOnBroadcast = value;
    });
  }

  onEmailAddressesChange(emailAddresses: string[]) {
    this.emailAddresses = emailAddresses;
  }

  onSave() {
    if (this.emailAddresses.length < 1) {
      this.notificationsService.warn(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('SETTINGS_PERSONAL_DATA_MODAL_EMAIL_ADDRESS_MINIMUM_ONE_EMAIL_ADDRESS')
      );
      return;
    }

    this._myUserService.setEmailAddressesPerRequest(this.emailAddresses).subscribe(
      (response: any) => {
        console.log(response);
        this._myUserService.setEmailAddresses(this.emailAddresses);
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('SETTINGS_PERSONAL_DATA_MODAL_EMAIL_ADDRESS_SAVED_SUCCESSFULLY')
        );
      },
      (error) => console.log(error)
    );
    this.dialog.close();
  }

  ngOnDestroy(): void {
    this.emailAddressesSubscription.unsubscribe();
    this.notifyViaEmailOnNewEventSubscription.unsubscribe();
    this.notifyMeViaEmailOnBroadcastSubscription.unsubscribe();
  }

  notifyMeOnNewEventChange(ob: MatSlideToggleChange) {
    this.settingsService.setNotifyMeOnNewEventViaEmail(ob.checked, true);
  }

  notifyMeViaEmailOnBroadcastChange(ob: MatSlideToggleChange) {
    this.settingsService.setNotifyMeViaEmailOnBroadcast(ob.checked, true);
  }
}
