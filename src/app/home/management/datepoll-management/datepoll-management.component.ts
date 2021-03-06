import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../../utils/settings.service';
import {MyUserService} from '../../my-user.service';
import {NotificationService} from '../../../utils/notification.service';
import {Permissions} from '../../../permissions';

import {ServerInfoModel} from '../../../utils/server-info.model';

@Component({
  selector: 'app-datepoll-management',
  templateUrl: './datepoll-management.component.html',
  styleUrls: ['./datepoll-management.component.css'],
})
export class DatepollManagementComponent implements OnDestroy {
  communityNameSaving = false;
  communityUrlSaving = false;
  communityDescriptionSaving = false;
  appUrlSaving = false;
  imprintSaving = false;
  privacyPolicySaving = false;

  serverInfo: ServerInfoModel;
  serverInfoSubscription: Subscription;

  openWeatherMapKey: string;
  openWeatherMapKeySubscription: Subscription;
  openWeatherMapKeySaving = false;

  openWeatherMapCinemaCityId: string;
  openWeatherMapCinemaCityIdSubscription: Subscription;
  openWeatherMapCinemaCityIdSaving = false;

  broadcastIncomingMailForwardingEmailAddresses: string[] = [];
  broadcastIncomingMailForwardingEmailAddressesSubscription: Subscription;
  broadcastIncomingMailForwardingEmailAddressesSaving = false;

  jitsiMeetInstanceUrl: string;
  jitsiMeetInstanceUrlSubscription: Subscription;
  jitsiMeetInstanceUrlSaving = false;

  alert: any;
  alertText = '';
  selectedAlertType = '';
  alertSubscription: Subscription;
  alertSaving = false;

  SETTINGS_ADMINISTRATION = Permissions.SETTINGS_ADMINISTRATION;
  SYSTEM_ADMINISTRATION = Permissions.SYSTEM_ADMINISTRATION;
  SYSTEM_LOGS_ADMINISTRATION = Permissions.SYSTEM_LOGS_ADMINISTRATION;
  SYSTEM_JOBS_ADMINISTRATION = Permissions.SYSTEM_JOBS_ADMINISTRATION;

  myUserService: MyUserService;

  constructor(
    private settingsService: SettingsService,
    myUserService: MyUserService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.myUserService = myUserService;

    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });

    this.openWeatherMapKey = settingsService.getOpenWeatherMapKey();
    this.openWeatherMapKeySubscription = settingsService.openWeatherMapKeyChange.subscribe((value) => {
      this.openWeatherMapKey = value;
    });

    this.openWeatherMapCinemaCityId = settingsService.getOpenWeatherMapCinemaCityId();
    this.openWeatherMapCinemaCityIdSubscription = settingsService.openWeatherMapCinemaCityIdChange.subscribe((value) => {
      this.openWeatherMapCinemaCityId = value;
    });

    this.broadcastIncomingMailForwardingEmailAddresses = settingsService.getBroadcastIncomingMailForwardingEmailAddresses();
    this.broadcastIncomingMailForwardingEmailAddressesSubscription =
      settingsService.broadcastIncomingMailForwardingEmailAddressesChange.subscribe((value) => {
        this.broadcastIncomingMailForwardingEmailAddresses = value;
      });

    this.alert = settingsService.getAlert();
    this.alertSubscription = settingsService.alertChange.subscribe((value) => {
      this.alert = value;
      this.alertText = this.alert.message;
      this.selectedAlertType = this.alert.type;
    });

    this.jitsiMeetInstanceUrl = settingsService.getJistiMeetInstanceUrl();
    this.jitsiMeetInstanceUrlSubscription = settingsService.jitsiMeetInstanceUrlChange.subscribe((value) => {
      this.jitsiMeetInstanceUrl = value;
    });
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
    this.openWeatherMapKeySubscription.unsubscribe();
    this.openWeatherMapCinemaCityIdSubscription.unsubscribe();
    this.broadcastIncomingMailForwardingEmailAddressesSubscription.unsubscribe();
    this.alertSubscription.unsubscribe();
    this.jitsiMeetInstanceUrlSubscription.unsubscribe();
  }

  cinemaServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowCinema(ob.checked);
  }

  eventsServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowEvents(ob.checked);
  }

  broadcastServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowBroadcasts(ob.checked);
  }

  broadcastProcessIncomingMailsChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminBroadcastProcessIncomingMails(ob.checked);
  }

  broadcastProcessIncomingMailsForwardingChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminBroadcastProcessIncomingMailsForwarding(ob.checked);
  }

  changeCommunityName(form: NgForm) {
    this.communityNameSaving = true;
    const communityName = form.controls.communityName.value;
    this.settingsService.setAdminCommunityName(communityName).subscribe(
      (response: any) => {
        console.log(response);
        this.communityNameSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_COMMUNITY_NAME_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeCommunityUrl(form: NgForm) {
    this.communityUrlSaving = true;
    const communityUrl = form.controls.communityUrl.value;
    this.settingsService.setAdminCommunityUrl(communityUrl).subscribe(
      (response: any) => {
        console.log(response);
        this.communityUrlSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_COMMUNITY_URL_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeCommunityDescription(form: NgForm) {
    this.communityDescriptionSaving = true;
    this.settingsService.setAdminCommunityDescription(form.controls.communityDescription.value).subscribe(
      (response: any) => {
        console.log(response);
        this.communityDescriptionSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_COMMUNITY_DESCRIPTION_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeImprint(form: NgForm) {
    this.imprintSaving = true;
    const imprint = form.controls.imprint.value;
    this.settingsService.setAdminCommunityImprint(imprint).subscribe(
      (response: any) => {
        console.log(response);
        this.imprintSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_IMPRINT_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changePrivacyPolicy(form: NgForm) {
    this.privacyPolicySaving = true;
    const privacyPolicy = form.controls.privacyPolicy.value;
    this.settingsService.setAdminCommunityPrivacyPolicy(privacyPolicy).subscribe(
      (response: any) => {
        console.log(response);
        this.privacyPolicySaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_PRIVACY_POLICY_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  autoDetectAppUrl() {
    this.serverInfo.application_url = 'https://' + window.location.host;
  }

  changeAppUrl(form: NgForm) {
    this.appUrlSaving = true;
    const appUrl = form.controls.appUrl.value;
    this.settingsService.setAdminAppUrl(appUrl).subscribe(
      (response: any) => {
        console.log(response);
        this.appUrlSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_APP_URL_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeOpenWeatherMapKey(form: NgForm) {
    this.openWeatherMapKeySaving = true;
    const openWeatherMapKey = form.controls.openWeatherMapKey.value;
    this.settingsService.setAdminOpenWeatherMapKey(openWeatherMapKey).subscribe(
      (response: any) => {
        console.log(response);
        this.openWeatherMapKeySaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_OPENWEATHERMAP_KEY_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeOpenWeatherMapCinemaCityId(form: NgForm) {
    this.openWeatherMapCinemaCityIdSaving = true;
    const openWeatherMapCinemaCityId = form.controls.openWeatherMapCinemaCityId.value;
    this.settingsService.setAdminOpenWeatherMapCinemaCityId(openWeatherMapCinemaCityId).subscribe(
      (response: any) => {
        console.log(response);
        this.openWeatherMapCinemaCityIdSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_OPENWEATHERMAP_CINEMA_CITY_ID_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeBroadcastIncomingMailForwardingEmailAddresses(strings: string[]) {
    this.broadcastIncomingMailForwardingEmailAddresses = strings;
  }

  saveBroadcastIncomingMailForwardingEmailAddresses() {
    this.broadcastIncomingMailForwardingEmailAddressesSaving = true;
    this.settingsService
      .setAdminBroadcastProcessIncomingMailsForwardingEmailAddresses(this.broadcastIncomingMailForwardingEmailAddresses)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.broadcastIncomingMailForwardingEmailAddressesSaving = false;
          this.notificationService.info(
            'MANAGEMENT_DATEPOLL_BROADCAST_PROCESS_INCOMING_MAILS_FORWARDING_EMAIL_ADDRESSES_CHANGED_SUCCESSFULLY'
          );
        },
        (error) => console.log(error)
      );
  }

  changeAlert(form: NgForm) {
    this.alertSaving = true;
    let alertS = form.controls.alert.value;
    if (alertS == null || alertS?.length === 0) {
      alertS = '';
    }
    const alert = {
      message: alertS,
      type: this.selectedAlertType,
    };
    this.settingsService.setAdminAlert(alert).subscribe(
      (response: any) => {
        console.log(response);
        this.alertSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_ALERT_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }

  changeJitsiMeetInstanceUrl(form: NgForm) {
    this.jitsiMeetInstanceUrlSaving = true;
    const jitsiMeetInstanceUrl = form.controls.jitsiMeetInstanceUrl.value;
    this.settingsService.setAdminJitsiMeetInstanceUrl(jitsiMeetInstanceUrl).subscribe(
      (response: any) => {
        console.log(response);
        this.jitsiMeetInstanceUrlSaving = false;
        this.notificationService.info('MANAGEMENT_DATEPOLL_JITSI_MEET_INSTANCE_URL_CHANGED_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }
}
