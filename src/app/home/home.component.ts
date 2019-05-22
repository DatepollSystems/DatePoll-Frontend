import {Component, NgZone, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Subscription} from 'rxjs';

import {MyUserService} from './my-user.service';
import {AuthService} from '../auth/auth.service';
import {SettingsService} from '../services/settings.service';
import {Permissions} from '../permissions';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  navBarOpened = false;
  navBarMode = 'over';

  @ViewChild('sidenav')
  private sidenav: MatSidenav;

  public myUserService: MyUserService;

  cinemaMovieAdministration = Permissions.CINEMA_MOVIE_ADMINISTRATION;
  managementAdministration = Permissions.MANAGEMENT_ADMINISTRATION;
  settingsAdministration = Permissions.SETTINGS_ADMINISTRATION;

  private firstnameSubscription: Subscription;
  firstname: string = null;

  private surnameSubscription: Subscription;
  surname: string = null;

  private emailSubscription: Subscription;
  email: string = null;

  private showCinemaSubscription: Subscription;
  showCinema = true;

  showPoll = false;

  constructor(
    private ngZone: NgZone,
    myUserService: MyUserService,
    private authService: AuthService,
    private settingsService: SettingsService) {

    this.myUserService = myUserService;

    if ((window.screen.width) > 992) {
      this.navBarOpened = true;
      this.navBarMode = 'side';
    }

    window.onresize = () => {
      this.ngZone.run(() => {
        if ((window.screen.width) > 992) {
          this.navBarOpened = true;
          this.navBarMode = 'side';
        } else {
          this.navBarOpened = false;
          this.navBarMode = 'over';
        }
      });
    };

    this.firstname = this.myUserService.getFirstname();
    this.firstnameSubscription = myUserService.firstnameChange.subscribe((value) => {
      this.firstname = value;
    });

    this.surname = this.myUserService.getSurname();
    this.surnameSubscription = myUserService.surnameChange.subscribe((value) => {
      this.surname = value;
    });

    this.email = this.myUserService.getEmail();
    this.emailSubscription = myUserService.emailChange.subscribe((value) => {
      this.email = value;
    });

    this.showCinema = settingsService.getShowCinema();
    this.showCinemaSubscription = settingsService.showCinemaChange.subscribe((value) => {
      this.showCinema = value;
    });
  }

  resizeNav() {
    if (this.navBarOpened) {
      this.sidenav.close();
      setTimeout(() => {
        this.sidenav.open();
      }, 250);
    }
  }

  logout() {
    this.authService.logout();
  }
}
