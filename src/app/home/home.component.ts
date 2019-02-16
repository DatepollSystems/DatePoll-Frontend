import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
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
export class HomeComponent implements OnInit {
  navBarOpened = false;
  navBarMode = 'over';

  @ViewChild('sidenav')
  private sidenav: MatSidenav;

  cinemaMovieAdministration: string;
  managementAdministration: string;

  private firstnameSubscription: Subscription;
  firstname: string;

  private surnameSubscription: Subscription;
  surname: string;

  private emailSubscription: Subscription;
  email: string;

  private showCinemaSubscription: Subscription;
  showCinema = true;

  showPoll = false;

  constructor(
    private ngZone: NgZone,
    private myUserService: MyUserService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router) {

    this.cinemaMovieAdministration = Permissions.CINEMA_MOVIE_ADMINISTRATION;
    this.managementAdministration = Permissions.MANAGEMENT_ADMINISTRATION;

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
      this.resizeNav();
    });

    this.surname = this.myUserService.getSurname();
    this.surnameSubscription = myUserService.surnameChange.subscribe((value) => {
      this.surname = value;
      this.resizeNav();
    });

    this.email = this.myUserService.getEmail();
    this.emailSubscription = myUserService.emailChange.subscribe((value) => {
      this.email = value;
      this.resizeNav();
    });

    this.showCinema = settingsService.getShowCinema();
    this.showCinemaSubscription = settingsService.showCinemaChange.subscribe((value) => {
      this.showCinema = value;
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAutenticated('homeComponent')) {
      this.router.navigate(['/signin']);
      return;
    }

    this.myUserService.fetchMyself();
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
    if (this.authService.logout()) {
      this.router.navigate(['/signin']);
    } else {
      console.log('homeComponent | logout | Something went wrong');
    }
  }
}
