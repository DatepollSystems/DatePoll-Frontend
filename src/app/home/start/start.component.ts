import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';

import {Subscription} from 'rxjs';

import {HomepageService} from './homepage.service';
import {CinemaService} from '../cinema/cinema.service';
import {MyUserService} from '../my-user.service';
import {EventsUserService} from '../events/events-user.service';

import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';
import {Event} from '../events/models/event.model';
import {EventInfoModalComponent} from '../events/event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from '../events/events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';

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

  events: Event[];
  eventsSubscription: Subscription;

  constructor(
    private homePageService: HomepageService,
    private cinemaService: CinemaService,
    public myUserService: MyUserService,
    private eventsUserSerivce: EventsUserService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog) {

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

    this.events = homePageService.getEvents().slice(0, 10);
    this.eventsSubscription = homePageService.eventsChange.subscribe((value) => {
      this.events = value.slice(0, 10);
      this.setBackgroundImage();
    });
  }

  ngOnInit() {
    this.setBackgroundImage();
  }

  setBackgroundImage() {
    if (this.birthdays.length === 0 && this.bookings.length === 0 && this.events.length === 0) {
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
    this.eventsSubscription.unsubscribe();

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

  onEventInfo(event: Event) {
    this.dialog.open(EventInfoModalComponent, {
      width: '80vh',
      'data': {
        'event': event
      }
    });
  }

  onEventVote(event: Event) {
    this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {'event': event},
    });
  }

  cancelEventVoting(event, button: any) {
    button.disabled = true;
    this.eventsUserSerivce.removeDecision(event.id).subscribe(
      (response: any) => {
        console.log(response);
        this.homePageService.fetchData();
        this.setBackgroundImage();
        // this.notificationsService.html(this.successfullyRemovedDecision, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }

}
