import {Component, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {Permissions} from '../permissions';
import {SettingsService} from '../services/settings.service';
import {MyUserService} from './my-user.service';
import {IsMobileService} from '../services/is-mobile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  private sidenav: MatSidenav;
  @ViewChild('sidenav', {static: true})
  navBarOpened = false;
  navBarMode = 'over';

  public myUserService: MyUserService;

  cinemaMovieAdministration = Permissions.CINEMA_MOVIE_ADMINISTRATION;
  eventAdministration = Permissions.EVENTS_ADMINISTRATION;
  managementAdministration = Permissions.MANAGEMENT_ADMINISTRATION;
  settingsAdministration = Permissions.SETTINGS_ADMINISTRATION;
  logsAdministration = Permissions.SYSTEM_LOGS_ADMINISTRATION;

  firstname: string = null;
  private firstnameSubscription: Subscription;

  surname: string = null;
  private surnameSubscription: Subscription;

  username: string = null;
  private usernameSubscription: Subscription;

  communityName = 'DatePoll';
  private communityNameSubscription: Subscription;

  showCinema = true;
  private showCinemaSubscription: Subscription;

  showEvents = true;
  private showEventsSubscription: Subscription;

  isMobileSubscription: Subscription;

  constructor(
    private ngZone: NgZone,
    myUserService: MyUserService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private isMobileService: IsMobileService
  ) {
    this.myUserService = myUserService;

    if (!this.isMobileService.getIsMobile()) {
      this.navBarOpened = true;
      this.navBarMode = 'side';
    }

    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe(isMobile => {
      if (isMobile) {
        this.navBarOpened = false;
        this.navBarMode = 'over';
      } else {
        this.navBarOpened = true;
        this.navBarMode = 'side';
      }
    });

    this.firstname = this.myUserService.getFirstname();
    this.firstnameSubscription = myUserService.firstnameChange.subscribe(value => {
      this.firstname = value;
    });

    this.surname = this.myUserService.getSurname();
    this.surnameSubscription = myUserService.surnameChange.subscribe(value => {
      this.surname = value;
    });

    this.username = this.myUserService.getUsername();
    this.usernameSubscription = this.myUserService.usernameChange.subscribe(value => {
      this.username = value;
    });

    this.communityName = this.settingsService.getCommunityName();
    this.communityNameSubscription = this.settingsService.communityNameChange.subscribe(value => {
      this.communityName = value;
    });

    this.showCinema = settingsService.getShowCinema();
    this.showCinemaSubscription = settingsService.showCinemaChange.subscribe(value => {
      this.showCinema = value;
    });

    this.showEvents = settingsService.getShowEvents();
    this.showEventsSubscription = settingsService.showEventsChange.subscribe(value => {
      this.showEvents = value;
    });
  }

  onPageChange() {
    // Close navbar after click only if webbrowser is mobile
    if (!(window.screen.width > 992)) {
      this.navBarOpened = false;
    }
  }

  ngOnDestroy(): void {
    this.firstnameSubscription.unsubscribe();
    this.surnameSubscription.unsubscribe();
    this.usernameSubscription.unsubscribe();
    this.communityNameSubscription.unsubscribe();
    this.showCinemaSubscription.unsubscribe();
    this.showEventsSubscription.unsubscribe();
    this.isMobileSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
