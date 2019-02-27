import { Component, OnInit } from '@angular/core';
import {MatSlideToggleChange} from '@angular/material';
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
export class DatepollManagementComponent implements OnInit {

  cinemaServiceEnabled = true;
  cinemaServiceEnabledChange: Subscription;

  permissionSubscription: Subscription;

  constructor(private settingsService: SettingsService, private myUserService: MyUserService, private router: Router) {
    this.cinemaServiceEnabled = settingsService.getShowCinema();
    this.cinemaServiceEnabledChange = settingsService.showCinemaChange.subscribe((value) => {
      this.cinemaServiceEnabled = value;
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

  cinemaServiceChange(ob: MatSlideToggleChange) {
    this.settingsService.setShowCinema(ob.checked);
  }

}
