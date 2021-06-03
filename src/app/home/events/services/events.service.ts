import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../utils/http.service';

import {EventDecision} from '../models/event-decision.model';
import {EventResultUser} from '../models/event-result-user.model';
import {Event} from '../models/event.model';
import {AHasYears} from '../../../utils/HasYears/AHasYears';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends AHasYears {
  private _events: Event[] = [];
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();

  constructor(httpService: HttpService) {
    super(httpService, '/avent/administration/avent/years');
  }

  public getEvents(year: number = null): Event[] {
    this._lastUsedYear = year;
    this.fetchEvents(year);
    return this._events.slice();
  }

  private setEvents(events: Event[]) {
    this._events = events;
    this.eventsChange.next(this._events.slice());
  }

  public fetchEvents(year: number = null) {
    if (this._lastUsedYear != null) {
      year = this._lastUsedYear;
    }
    let url = '/avent/administration/avent';
    if (year != null) {
      url += '/' + year;
    } else {
      url += '/null';
    }
    this.httpService.loggedInV1GETRequest(url, 'fetchEvents').subscribe(
      (data: any) => {
        console.log(data);

        const events = [];
        const fetchedEvents = data.data;
        for (const fetchedEvent of fetchedEvents) {
          events.push(Event.createOfDTO(fetchedEvent));
        }

        this.setEvents(events);
      },
      (error) => console.log(error)
    );
  }

  public deleteEvent(id: number) {
    return this.httpService.loggedInV1DELETERequest('/avent/administration/avent/' + id, 'deleteEvent');
  }

  public voteForUsers(event: Event, decision: EventDecision, additionalInformation: string, users: EventResultUser[]) {
    const userIds = [];
    for (const user of users) {
      userIds.push(user.id);
    }

    const dto = {
      decision_id: decision.id,
      user_ids: userIds,
      additional_information: additionalInformation,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/avent/' + event.id + '/voteForUsers', dto);
  }

  public cancelVotingForUsers(event: Event, users: EventResultUser[]) {
    const userIds = [];
    for (const user of users) {
      userIds.push(user.id);
    }

    const dto = {
      user_ids: userIds,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/avent/' + event.id + '/cancelVotingForUsers', dto);
  }
}
