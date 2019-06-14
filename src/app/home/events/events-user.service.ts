import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {Event} from './models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsUserService {

  private _events: Event[] = [];
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();

  constructor(public httpService: HttpService) { }

  public getEvents(): Event[] {
    this.fetchEvents();
    return this._events.slice();
  }

  public setEvents(events: Event[]) {
    this._events = events;
    this.eventsChange.next(this._events.slice());
  }

  public fetchEvents() {
    this.httpService.loggedInV1GETRequest('/avent', 'fetchOpenEvents').subscribe(
      (data: any) => {
        console.log(data);

        const events = [];
        const fetchedEvents = data.events;
        for (let i = 0; i < fetchedEvents.length; i++) {
          const fetchedEvent = fetchedEvents[i];
          const event = new Event(fetchedEvent.id, fetchedEvent.name, new Date(fetchedEvent.startDate), new Date(fetchedEvent.endDate),
            fetchedEvent.forEveryone, fetchedEvent.description, fetchedEvent.decisions);
          event.alreadyVotedFor = fetchedEvent.alreadyVoted;
          events.push(event);
        }

        this.setEvents(events);
      },
      (error) => console.log(error)
    );
  }

  public voteForDecision(eventId, decision) {
    const dto = {
      'event_id': eventId,
      'decision': decision
    };
    return this.httpService.loggedInV1POSTRequest('/avent/vote', dto, 'voteForDecision');
  }

  public removeDecision(eventId) {
    return this.httpService.loggedInV1DELETERequest('/avent/vote/' + eventId, 'removeDecision');
  }
}
