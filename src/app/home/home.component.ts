import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {MyUserService} from '../auth/my-user.service';
import {AuthService} from '../auth/auth.service';
import {SettingsService} from '../settings.service';


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

    this.showCinemaSubscription = settingsService.showCinemaChange.subscribe((value) => {
      this.showCinema = value;
    });

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
    this.surname = this.myUserService.getSurname();
    this.email = this.myUserService.getEmail();

    this.firstnameSubscription = myUserService.firstnameChange.subscribe((value) => {
      this.firstname = value;
      this.resizeNav();
    });

    this.surnameSubscription = myUserService.surnameChange.subscribe((value) => {
      this.surname = value;
      this.resizeNav();
    });

    this.emailSubscription = myUserService.emailChange.subscribe((value) => {
      this.email = value;
      this.resizeNav();
    });

    this.showCinema = settingsService.getShowCinema();
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
