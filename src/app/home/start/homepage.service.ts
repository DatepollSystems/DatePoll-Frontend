import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {HttpService} from '../../services/http.service';

import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';
import {Event} from '../events/models/event.model';
import {Decision} from '../events/models/decision.model';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  public birthdaysChange: Subject<HomeBirthdayModel[]> = new Subject<HomeBirthdayModel[]>();
  public bookingsChange: Subject<HomeBookingsModel[]> = new Subject<HomeBookingsModel[]>();
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();
  private _birthdays: HomeBirthdayModel[] = [];
  private _bookings: HomeBookingsModel[] = [];
  private _events: Event[] = [];

  constructor(private httpService: HttpService) {
  }

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

  public fetchData() {
    this.httpService.loggedInV1GETRequest('/user/homepage', 'fetchHomepageData').subscribe(
      (data: any) => {
        console.log(data);

        const bookings = data.bookings;

        const bookingsToSave = [];
        for (let i = 0; i < bookings.length; i++) {
          bookingsToSave.push(new HomeBookingsModel(bookings[i].movie_id, bookings[i].movie_name, bookings[i].amount,
            bookings[i].movie_date, bookings[i].worker_id, bookings[i].worker_name, bookings[i].emergency_worker_id,
            bookings[i].emergency_worker_name));
        }

        this.setBookings(bookingsToSave);

        const birthdays = data.birthdays;

        const birthdaysToSave = [];
        for (let i = 0; i < birthdays.length; i++) {
          birthdaysToSave.push(new HomeBirthdayModel(birthdays[i].name, birthdays[i].date));
        }

        this.setBirthdays(birthdaysToSave);

        const events = data.events;
        const eventsToSave = [];
        for (let i = 0; i < events.length; i++) {
          const fetchedEvent = events[i];

          const decisions = [];
          for (const decision of fetchedEvent.decisions) {
            decisions.push(new Decision(decision.id, decision.decision));
          }

          const event = new Event(fetchedEvent.id, fetchedEvent.name, new Date(fetchedEvent.start_date), new Date(fetchedEvent.end_date),
            fetchedEvent.for_everyone, fetchedEvent.description, fetchedEvent.location, decisions);
          event.alreadyVotedFor = fetchedEvent.already_voted;
          eventsToSave.push(event);
        }
        this.setEvents(eventsToSave);
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
}
