import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../services/converter';
import {HttpService} from '../../services/http.service';

import {Decision} from './models/decision.model';
import {EventDate} from './models/event-date.model';
import {Event} from './models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsUserService {
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();
  private _events: Event[] = [];

  constructor(public httpService: HttpService) {}

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

          const dates = [];
          for (const fetchedDate of fetchedEvent.dates) {
            const date = new EventDate(
              fetchedDate.id,
              fetchedDate.location,
              fetchedDate.x,
              fetchedDate.y,
              Converter.getIOSDate(fetchedDate.date),
              fetchedDate.description
            );
            dates.push(date);
          }

          const event = new Event(
            fetchedEvent.id,
            fetchedEvent.name,
            Converter.getIOSDate(fetchedEvent.start_date),
            Converter.getIOSDate(fetchedEvent.end_date),
            fetchedEvent.for_everyone,
            fetchedEvent.description,
            decisions,
            dates
          );
          event.alreadyVotedFor = fetchedEvent.already_voted;
          event.additionalInformation = fetchedEvent.additional_information;
          event.userDecision = fetchedEvent.user_decision;
          events.push(event);
        }

        this.setEvents(events);
      },
      error => console.log(error)
    );
  }

  public voteForDecision(eventId: number, decision: Decision, additionalInformation = null) {
    const dto = {
      event_id: eventId,
      decision_id: decision.id,
      additional_information: additionalInformation
    };
    return this.httpService.loggedInV1POSTRequest('/avent/vote', dto, 'voteForDecision');
  }

  public removeDecision(eventId) {
    return this.httpService.loggedInV1DELETERequest('/avent/vote/' + eventId, 'removeDecision');
  }
}
