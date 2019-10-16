import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subscription} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';

import {SettingsService} from '../../../services/settings.service';
import {MyUserService} from '../../my-user.service';
import {TranslateService} from '../../../translation/translate.service';

import {Permissions} from '../../../permissions';

@Component({
  selector: 'app-datepoll-management',
  templateUrl: './datepoll-management.component.html',
  styleUrls: ['./datepoll-management.component.css']
})
export class DatepollManagementComponent implements OnInit, OnDestroy {
  cinemaServiceEnabled = true;
  cinemaServiceEnabledChange: Subscription;

  eventsServiceEnabled = true;
  eventsServiceEnabledChange: Subscription;

  communityName: string;
  communityNameSubscription: Subscription;
  communityNameSaving = false;

  communityUrl: string;
  communityUrlSubscription: Subscription;
  communityUrlSaving = false;

  openWeatherMapKey: string;
  openWeatherMapKeySubscription: Subscription;
  openWeatherMapKeySaving = false;

  openWeatherMapCinemaCityId: string;
  openWeatherMapCinemaCityIdSubscription: Subscription;
  openWeatherMapCinemaCityIdSaving = false;

  SETTINGS_ADMINISTRATION = Permissions.SETTINGS_ADMINISTRATION;
  SYSTEM_LOGS_ADMINISTRATION = Permissions.SYSTEM_LOGS_ADMINISTRATION;
  permissionSubscription: Subscription;

  constructor(private settingsService: SettingsService,
              private myUserService: MyUserService,
              private router: Router,
              private translate: TranslateService,
              private notificationsService: NotificationsService) {
    this.cinemaServiceEnabled = settingsService.getShowCinema();
    this.cinemaServiceEnabledChange = settingsService.showCinemaChange.subscribe((value) => {
      this.cinemaServiceEnabled = value;
    });

    this.eventsServiceEnabled = settingsService.getShowEvents();
    this.eventsServiceEnabledChange = settingsService.showEventsChange.subscribe((value) => {
      this.eventsServiceEnabled = value;
    });

    this.communityName = settingsService.getCommunityName();
    this.communityNameSubscription = settingsService.communityNameChange.subscribe((value) => {
      this.communityName = value;
    });

    this.communityUrl = settingsService.getCommunityUrl();
    this.communityUrlSubscription = settingsService.communityUrlChange.subscribe((value) => {
      this.communityUrl = value;
    });

    this.openWeatherMapKey = settingsService.getOpenWeatherMapKey();
    this.openWeatherMapKeySubscription = settingsService.openWeatherMapKeyChange.subscribe((value) => {
      this.openWeatherMapKey = value;
    });

    this.openWeatherMapCinemaCityId = settingsService.getOpenWeatherMapCinemaCityId();
    this.openWeatherMapCinemaCityIdSubscription = settingsService.openWeatherMapCinemaCityIdChange.subscribe((value) => {
      this.openWeatherMapCinemaCityId = value;
    });

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.SETTINGS_ADMINISTRATION) &&
        !this.myUserService.hasPermission(Permissions.SYSTEM_LOGS_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit() {
    if (!this.myUserService.hasPermission(Permissions.SETTINGS_ADMINISTRATION) &&
      !this.myUserService.hasPermission(Permissions.SYSTEM_LOGS_ADMINISTRATION)) {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    this.cinemaServiceEnabledChange.unsubscribe();
    this.eventsServiceEnabledChange.unsubscribe();
    this.communityNameSubscription.unsubscribe();
    this.communityUrlSubscription.unsubscribe();
    this.openWeatherMapKeySubscription.unsubscribe();
    this.openWeatherMapCinemaCityIdSubscription.unsubscribe();
    this.permissionSubscription.unsubscribe();
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
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_COMMUNITY_NAME_CHANGED_SUCCESSFULLY'));
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
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_COMMUNITY_URL_CHANGED_SUCCESSFULLY'));
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
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_OPENWEATHERMAP_KEY_CHANGED_SUCCESSFULLY'));
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
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_OPENWEATHERMAP_CINEMA_CITY_ID_CHANGED_SUCCESSFULLY'));
      },
      (error) => console.log(error)
    );
  }

}
