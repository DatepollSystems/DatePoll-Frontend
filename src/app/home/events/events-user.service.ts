import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../utils/helper/Converter';
import {HttpService} from '../../utils/http.service';

import {EventDecision} from './models/event-decision.model';
import {Event} from './models/event.model';

@Injectable({
  providedIn: 'root',
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
        for (const fetchedEvent of fetchedEvents) {
          const decisions = [];
          for (const fetchedDecision of fetchedEvent.decisions) {
            decisions.push(EventDecision.createOfDTO(fetchedDecision));
          }

          const event = Event.createOfDTO(fetchedEvent, decisions);
          event.alreadyVotedFor = Converter.numberToBoolean(fetchedEvent.already_voted);
          if (event.alreadyVotedFor) {
            event.userDecision = fetchedEvent.user_decision.decision;
            event.additionalInformation = fetchedEvent.user_decision.additional_information;
            event.decisionColor = fetchedEvent.user_decision.color;
          }
          events.push(event);
        }

        this.setEvents(events);
      },
      (error) => console.log(error)
    );
  }

  public voteForDecision(eventId: number, decision: EventDecision, additionalInformation = null) {
    const dto = {
      event_id: eventId,
      decision_id: decision.id,
      additional_information: additionalInformation,
    };
    return this.httpService.loggedInV1POSTRequest('/avent/vote', dto, 'voteForDecision');
  }

  public removeDecision(eventId) {
    return this.httpService.loggedInV1DELETERequest('/avent/vote/' + eventId, 'removeDecision');
  }
}
