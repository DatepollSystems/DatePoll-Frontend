import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SettingsService} from '../../../services/settings.service';
import {Subscription} from 'rxjs';
import {MyUserService} from '../../my-user.service';
import {Permissions} from '../../../permissions';
import {Router} from '@angular/router';

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

  permissionSubscription: Subscription;

  constructor(private settingsService: SettingsService, private myUserService: MyUserService, private router: Router) {
    this.cinemaServiceEnabled = settingsService.getShowCinema();
    this.cinemaServiceEnabledChange = settingsService.showCinemaChange.subscribe((value) => {
      this.cinemaServiceEnabled = value;
    });

    this.eventsServiceEnabled = settingsService.getShowEvents();
    this.eventsServiceEnabledChange = settingsService.showEventsChange.subscribe((value) => {
      this.eventsServiceEnabled = value;
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
    this.permissionSubscription.unsubscribe();
  }

  cinemaServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowCinema(ob.checked);
  }

  eventsServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setAdminShowEvents(ob.checked);
  }

}
