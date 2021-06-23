import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {HomepageService} from './homepage.service';
import {Converter} from '../../utils/helper/Converter';

import {Broadcast} from '../broadcasts/models/broadcast.model';
import {Event} from '../events/models/event.model';
import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';

import {SettingsService} from '../../utils/settings.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnDestroy {
  birthdays: HomeBirthdayModel[];
  birthdaysSubscription: Subscription;
  showBirthdays = false;

  bookings: HomeBookingsModel[];
  bookingsSubscription: Subscription;

  events: Event[];
  eventsSubscription: Subscription;

  broadcasts: Broadcast[];
  broadcastSubscription: Subscription;

  eventVotingChangeLoading = false;
  openEventsCount = 0;
  loaded = false;

  alert: any;
  alertSubscription: Subscription;
  showFirework = false;

  constructor(private homePageService: HomepageService, private router: Router, private settingsService: SettingsService) {
    this.birthdays = homePageService.getBirthdays();
    this.birthdaysSubscription = homePageService.birthdaysChange.subscribe((value) => {
      this.birthdays = value;
    });

    this.bookings = homePageService.getBookings();
    this.bookingsSubscription = homePageService.bookingsChange.subscribe((value) => {
      this.bookings = value;
      this.loaded = true;
    });

    this.events = homePageService.getEvents();
    this.countOpenEvents();
    this.eventsSubscription = homePageService.eventsChange.subscribe((value) => {
      this.events = value;
      this.countOpenEvents();
      this.eventVotingChangeLoading = false;
      this.loaded = true;
    });

    this.broadcasts = homePageService.getBroadcasts();
    this.broadcastSubscription = homePageService.broadcastChange.subscribe((value) => {
      this.broadcasts = value;
      this.loaded = true;
    });

    this.alert = this.settingsService.getAlert();
    this.checkIfFireworkShouldBeShown();
    this.alertSubscription = this.settingsService.alertChange.subscribe((value) => {
      this.alert = value;
      this.checkIfFireworkShouldBeShown();
    });
  }

  ngOnDestroy() {
    this.bookingsSubscription.unsubscribe();
    this.birthdaysSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
    this.broadcastSubscription.unsubscribe();
  }

  onBroadcastItemClick(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/' + broadcast.id, {state: broadcast});
  }

  ticketBookingOrCancelChange() {
    this.homePageService.fetchData(true);
  }

  private countOpenEvents() {
    this.openEventsCount = 0;
    for (const event of this.events) {
      if (!event.alreadyVotedFor) {
        this.openEventsCount++;
      }
    }
  }

  private checkIfFireworkShouldBeShown() {
    if (this.alert?.message?.trim().toLowerCase().length > 0 && this.alert?.type?.includes('happy')) {
      if (localStorage.getItem('firework') == null) {
        localStorage.setItem('firework', Converter.booleanToString(true));
      }
      this.showFirework = Converter.stringToBoolean(localStorage.getItem('firework'));
    }
  }

  toggleFirework() {
    this.showFirework = !this.showFirework;
    localStorage.setItem('firework', Converter.booleanToString(this.showFirework));
  }
}
