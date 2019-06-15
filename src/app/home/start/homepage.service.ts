import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {HttpService} from '../../services/http.service';

import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';
import {Event} from '../events/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  private _birthdays: HomeBirthdayModel[] = [];
  public birthdaysChange: Subject<HomeBirthdayModel[]> = new Subject<HomeBirthdayModel[]>();

  private _bookings: HomeBookingsModel[] = [];
  public bookingsChange: Subject<HomeBookingsModel[]> = new Subject<HomeBookingsModel[]>();

  private _events: Event[] = [];
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();

  constructor(private httpService: HttpService) {
  }

  private setBirthdays(birthdays: HomeBirthdayModel[]) {
    this._birthdays = birthdays;
    this.birthdaysChange.next(this._birthdays.slice());
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

  private setEvents(events: Event[]) {
    this._events = events;
    this.eventsChange.next(this._events.slice());
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
          bookingsToSave.push(new HomeBookingsModel(bookings[i].movieID, bookings[i].movieName, bookings[i].amount, bookings[i].movieDate,
            bookings[i].workerID, bookings[i].workerName, bookings[i].emergencyWorkerID, bookings[i].emergencyWorkerName));
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
          const event = new Event(fetchedEvent.id, fetchedEvent.name, new Date(fetchedEvent.startDate), new Date(fetchedEvent.endDate),
            fetchedEvent.forEveryone, fetchedEvent.description, fetchedEvent.decisions);
          event.alreadyVotedFor = fetchedEvent.alreadyVoted;
          eventsToSave.push(event);
        }
        this.setEvents(eventsToSave);
      },
      (error) => console.log(error)
    );
  }
}
