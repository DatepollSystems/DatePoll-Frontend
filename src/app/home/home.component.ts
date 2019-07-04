import {Component, NgZone, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
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
  public myUserService: MyUserService;
  cinemaMovieAdministration = Permissions.CINEMA_MOVIE_ADMINISTRATION;
  eventAdministration = Permissions.EVENTS_ADMINISTRATION;
  managementAdministration = Permissions.MANAGEMENT_ADMINISTRATION;
  settingsAdministration = Permissions.SETTINGS_ADMINISTRATION;
  firstname: string = null;
  surname: string = null;
  username: string = null;
  showCinema = true;
  showEvents = true;
  @ViewChild('sidenav', {static: true})
  private sidenav: MatSidenav;
  private firstnameSubscription: Subscription;
  private surnameSubscription: Subscription;
  private usernameSubscription: Subscription;
  private showCinemaSubscription: Subscription;
  private showEventsSubscription: Subscription;

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

    this.username = this.myUserService.getUsername();
    this.usernameSubscription = this.myUserService.usernameChange.subscribe((value) => {
      this.username = value;
    });

    this.showCinema = settingsService.getShowCinema();
    this.showCinemaSubscription = settingsService.showCinemaChange.subscribe((value) => {
      this.showCinema = value;
    });

    this.showEvents = settingsService.getShowEvents();
    this.showEventsSubscription = settingsService.showEventsChange.subscribe((value) => {
      this.showEvents = value;
    });
  }

  onPageChange() {
    // Close navbar after click only if webbrowser is mobile
    if (!((window.screen.width) > 992)) {
      this.navBarOpened = false;
    }
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
