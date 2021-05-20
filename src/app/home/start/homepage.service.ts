import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Converter} from '../../utils/helper/Converter';
import {HttpService} from '../../utils/http.service';

import {TranslateService} from '../../translation/translate.service';
import {Broadcast} from '../broadcasts/models/broadcast.model';
import {EventDecision} from '../events/models/event-decision.model';
import {Event} from '../events/models/event.model';
import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  public birthdaysChange: Subject<HomeBirthdayModel[]> = new Subject<HomeBirthdayModel[]>();
  public bookingsChange: Subject<HomeBookingsModel[]> = new Subject<HomeBookingsModel[]>();
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();
  public broadcastChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();
  private _birthdays: HomeBirthdayModel[] = [];
  private _bookings: HomeBookingsModel[] = [];
  private _events: Event[] = [];
  private _broadcasts: Broadcast[] = [];

  private counter = 3;

  constructor(private httpService: HttpService, private translate: TranslateService) {}

  public getBirthdays(): HomeBirthdayModel[] {
    this.fetchData();
    return this._birthdays.slice();
  }

  public setBookings(bookings: HomeBookingsModel[]) {
    this._bookings = bookings;
    this.bookingsChange.next(this._bookings.slice());
  }

  public getBookings(): HomeBookingsModel[] {
    this.fetchData();
    return this._bookings.slice();
  }

  public getEvents(): Event[] {
    this.fetchData();
    return this._events.slice();
  }

  public getBroadcasts(): Broadcast[] {
    this.fetchData();
    return this._broadcasts.slice();
  }

  public fetchData(force = false) {
    if (this.counter === 3) {
      force = true;
    }

    if (this.counter < 3 && !force) {
      this.counter++;
      return;
    }
    this.counter = 1;

    this.httpService.loggedInV1GETRequest('/user/homepage', 'fetchHomepageData').subscribe(
      (data: any) => {
        console.log(data);

        const bookingsToSave = [];
        for (const booking of data.bookings) {
          bookingsToSave.push(
            new HomeBookingsModel(
              booking.movie_id,
              booking.movie_name,
              booking.amount,
              booking.movie_date,
              booking.worker_id,
              booking.worker_name,
              booking.emergency_worker_id,
              booking.emergency_worker_name
            )
          );
        }

        this.setBookings(bookingsToSave);

        const birthdaysToSave = [];
        for (const birthday of data.birthdays) {
          birthdaysToSave.push(
            new HomeBirthdayModel(birthday.name, new Date(birthday.date), this.translate.getTranslationFor('CALENDAR_USERS_BIRTHDAY'))
          );
        }

        this.setBirthdays(birthdaysToSave);

        const eventsToSave = [];
        for (const fetchedEvent of data.events) {
          const decisions = [];
          for (const decision of fetchedEvent.decisions) {
            decisions.push(EventDecision.createOfDTO(decision));
          }

          const event = Event.createOfDTO(fetchedEvent, decisions);
          event.alreadyVotedFor = fetchedEvent.already_voted;
          if (event.alreadyVotedFor) {
            event.userDecision = fetchedEvent.user_decision.decision;
            event.additionalInformation = fetchedEvent.user_decision.additional_information;
            event.decisionColor = fetchedEvent.user_decision.color;
          }
          eventsToSave.push(event);
        }
        this.setEvents(eventsToSave);

        const broadcasts = [];
        for (const broadcast of data.broadcasts) {
          broadcasts.push(Broadcast.createOfDTO(broadcast));
        }
        this.setBroadcasts(broadcasts);
      },
      (error) => console.log(error)
    );
  }

  private setBirthdays(birthdays: HomeBirthdayModel[]) {
    this._birthdays = birthdays;
    this.birthdaysChange.next(this._birthdays.slice());
  }

  private setEvents(events: Event[]) {
    this._events = events;
    this.eventsChange.next(this._events.slice());
  }

  private setBroadcasts(broadcasts: Broadcast[]) {
    this._broadcasts = broadcasts;
    this.broadcastChange.next(this._broadcasts.slice());
  }
}
