import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {Event} from './models/event.model';
import {Decision} from './models/decision.model';

@Injectable({
  providedIn: 'root'
})
export class EventsUserService {

  public eventsChange: Subject<Event[]> = new Subject<Event[]>();
  private _events: Event[] = [];

  constructor(public httpService: HttpService) {
  }

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

          const decisions = [];
          for (const fetchedDecision of fetchedEvent.decisions) {
            decisions.push(new Decision(fetchedDecision.id, fetchedDecision.decision));
          }

          const event = new Event(fetchedEvent.id, fetchedEvent.name, new Date(fetchedEvent.startDate), new Date(fetchedEvent.endDate),
            fetchedEvent.forEveryone, fetchedEvent.description, fetchedEvent.location, decisions);
          event.alreadyVotedFor = fetchedEvent.alreadyVoted;
          events.push(event);
        }

        this.setEvents(events);
      },
      (error) => console.log(error)
    );
  }

  public voteForDecision(eventId: number, decision: Decision) {
    const dto = {
      'event_id': eventId,
      'decision_id': decision.id
    };
    return this.httpService.loggedInV1POSTRequest('/avent/vote', dto, 'voteForDecision');
  }

  public removeDecision(eventId) {
    return this.httpService.loggedInV1DELETERequest('/avent/vote/' + eventId, 'removeDecision');
  }
}
