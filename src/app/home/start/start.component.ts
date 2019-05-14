import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';

import {HomepageService} from './homepage.service';
import {CinemaService} from '../cinema/cinema.service';

import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';
import {MyUserService} from '../my-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {

  birthdays: HomeBirthdayModel[];
  birthdaysSubscription: Subscription;

  bookings: HomeBookingsModel[];
  bookingsSubscription: Subscription;

  constructor(private homePageService: HomepageService, private cinemaService: CinemaService, public myUserService: MyUserService) {
    this.birthdays = homePageService.getBirthdays();
    this.birthdaysSubscription = homePageService.birthdaysChange.subscribe((value) => {
      this.birthdays = value;
      this.setBackgroundImage();
    });

    this.bookings = homePageService.getBookings();
    this.bookingsSubscription = homePageService.bookingsChange.subscribe((value) => {
      this.bookings = value;
      this.setBackgroundImage();
    });
  }

  ngOnInit() {
    this.setBackgroundImage();
  }

  setBackgroundImage() {
    if (this.birthdays.length === 0 && this.bookings.length === 0) {
      const currentDate = new Date();

      if (currentDate.getHours() >= 19 || currentDate.getHours() <= 7) {
        document.getElementById('my-container').style.backgroundImage = 'url(/assets/startpage-background-night.jpg)';
      } else {
        document.getElementById('my-container').style.backgroundImage = 'url(/assets/startpage-background-day.jpg)';
      }

      document.getElementById('my-container').style.backgroundSize = 'cover';
    } else {
      document.getElementById('my-container').style.background = 'none';
    }
  }

  ngOnDestroy() {
    this.bookingsSubscription.unsubscribe();
    this.birthdaysSubscription.unsubscribe();

    document.getElementById('my-container').style.background = 'none';
  }

  applyForWorker(movieID: number, element: any) {
    element.disabled = true;
    this.cinemaService.applyForWorker(movieID);
  }

  signOutForWorker(movieID: number, element: any) {
    element.disabled = true;
    this.cinemaService.signOutForWorker(movieID);
  }

  applyForEmergencyWorker(movieID: number, element: any) {
    element.disabled = true;
    this.cinemaService.applyForEmergencyWorker(movieID);
  }

  signOutForEmergencyWorker(movieID: number, element: any) {
    element.disabled = true;
    this.cinemaService.signOutForEmergencyWorker(movieID);
  }

}
