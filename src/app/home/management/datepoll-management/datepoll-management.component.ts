import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';

import {TranslateService} from '../../../translation/translate.service';
import {SettingsService} from '../../../utils/settings.service';
import {MyUserService} from '../../my-user.service';

import {Permissions} from '../../../permissions';
import {ServerInfoModel} from '../../../utils/server-info.model';

@Component({
  selector: 'app-datepoll-management',
  templateUrl: './datepoll-management.component.html',
  styleUrls: ['./datepoll-management.component.css']
})
export class DatepollManagementComponent implements OnDestroy {
  communityNameSaving = false;
  communityUrlSaving = false;
  appUrlSaving = false;

  serverInfo: ServerInfoModel;
  serverInfoSubscription: Subscription;

  openWeatherMapKey: string;
  openWeatherMapKeySubscription: Subscription;
  openWeatherMapKeySaving = false;

  openWeatherMapCinemaCityId: string;
  openWeatherMapCinemaCityIdSubscription: Subscription;
  openWeatherMapCinemaCityIdSaving = false;

  SETTINGS_ADMINISTRATION = Permissions.SETTINGS_ADMINISTRATION;
  SYSTEM_LOGS_ADMINISTRATION = Permissions.SYSTEM_LOGS_ADMINISTRATION;

  myUserService: MyUserService;

  constructor(
    private settingsService: SettingsService,
    myUserService: MyUserService,
    private router: Router,
    private translate: TranslateService,
    private notificationsService: NotificationsService
  ) {
    this.myUserService = myUserService;

    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe(value => {
      this.serverInfo = value;
    });

    this.openWeatherMapKey = settingsService.getOpenWeatherMapKey();
    this.openWeatherMapKeySubscription = settingsService.openWeatherMapKeyChange.subscribe(value => {
      this.openWeatherMapKey = value;
    });

    this.openWeatherMapCinemaCityId = settingsService.getOpenWeatherMapCinemaCityId();
    this.openWeatherMapCinemaCityIdSubscription = settingsService.openWeatherMapCinemaCityIdChange.subscribe(value => {
      this.openWeatherMapCinemaCityId = value;
    });
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
    this.openWeatherMapKeySubscription.unsubscribe();
    this.openWeatherMapCinemaCityIdSubscription.unsubscribe();
  }

  cinemaServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowCinema(ob.checked);
  }

  eventsServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowEvents(ob.checked);
  }

  changeCommunityName(form: NgForm) {
    this.communityNameSaving = true;
    const communityName = form.controls.communityName.value;
    this.settingsService.setAdminCommunityName(communityName).subscribe(
      (response: any) => {
        console.log(response);
        this.communityNameSaving = false;
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_COMMUNITY_NAME_CHANGED_SUCCESSFULLY')
        );
      },
      error => console.log(error)
    );
  }

  changeCommunityUrl(form: NgForm) {
    this.communityUrlSaving = true;
    const communityUrl = form.controls.communityUrl.value;
    this.settingsService.setAdminCommunityUrl(communityUrl).subscribe(
      (response: any) => {
        console.log(response);
        this.communityUrlSaving = false;
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_COMMUNITY_URL_CHANGED_SUCCESSFULLY')
        );
      },
      error => console.log(error)
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
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_APP_URL_CHANGED_SUCCESSFULLY')
        );
      },
      error => console.log(error)
    );
  }

  changeOpenWeatherMapKey(form: NgForm) {
    this.openWeatherMapKeySaving = true;
    const openWeatherMapKey = form.controls.openWeatherMapKey.value;
    this.settingsService.setAdminOpenWeatherMapKey(openWeatherMapKey).subscribe(
      (response: any) => {
        console.log(response);
        this.openWeatherMapKeySaving = false;
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_OPENWEATHERMAP_KEY_CHANGED_SUCCESSFULLY')
        );
      },
      error => console.log(error)
    );
  }

  changeOpenWeatherMapCinemaCityId(form: NgForm) {
    this.openWeatherMapCinemaCityIdSaving = true;
    const openWeatherMapCinemaCityId = form.controls.openWeatherMapCinemaCityId.value;
    this.settingsService.setAdminOpenWeatherMapCinemaCityId(openWeatherMapCinemaCityId).subscribe(
      (response: any) => {
        console.log(response);
        this.openWeatherMapCinemaCityIdSaving = false;
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_OPENWEATHERMAP_CINEMA_CITY_ID_CHANGED_SUCCESSFULLY')
        );
      },
      error => console.log(error)
    );
  }
}
