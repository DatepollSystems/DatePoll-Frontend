import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SettingsService} from '../../../services/settings.service';
import {Subscription} from 'rxjs';
import {MyUserService} from '../../my-user.service';
import {Permissions} from '../../../permissions';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../../../translation/translate.service';

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

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.SETTINGS_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit() {
    if (!this.myUserService.hasPermission(Permissions.SETTINGS_ADMINISTRATION)) {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    this.cinemaServiceEnabledChange.unsubscribe();
    this.eventsServiceEnabledChange.unsubscribe();
    this.communityNameSubscription.unsubscribe();
    this.permissionSubscription.unsubscribe();
  }

  cinemaServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowCinema(ob.checked);
  }

  eventsServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowEvents(ob.checked);
  }

  changeCommunityName(form: NgForm) {
    const communityName = form.controls.communityName.value;
    this.settingsService.setAdminCommunityName(communityName).subscribe(
      (response: any) => {
        console.log(response);
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_COMMUNITY_NAME_CHANGED_SUCCESSFULLY'));
      },
      (error) => console.log(error)
    );
  }

}
