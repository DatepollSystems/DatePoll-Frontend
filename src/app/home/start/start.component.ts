import {Component, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';

import {HomepageService} from './homepage.service';
import {CinemaService} from '../cinema/cinema.service';

import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  birthdays: HomeBirthdayModel[];
  birthdaysSubscription: Subscription;

  bookings: HomeBookingsModel[];
  bookingsSubscription: Subscription;

  constructor(private homePageService: HomepageService, public cinemaService: CinemaService) {
    this.birthdays = homePageService.getBirthdays();
    this.birthdaysSubscription = homePageService.birthdaysChange.subscribe((value) => {
      this.birthdays = value;
    });

    this.bookings = homePageService.getBookings();
    this.bookingsSubscription = homePageService.bookingsChange.subscribe((value) => {
      this.bookings = value;
    });
  }

  ngOnInit() {
  }

}
