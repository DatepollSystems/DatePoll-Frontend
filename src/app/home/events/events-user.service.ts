import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../utils/http.service';

import {EventDecision} from './models/event-decision.model';
import {Event} from './models/event.model';
import {EventResultUser} from './models/event-result-user.model';
import {EventResultGroup} from './models/event-result-group.model';
import {EventResultSubgroup} from './models/event-result-subgroup.model';

@Injectable({
  providedIn: 'root',
})
export class EventsUserService {
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();
  private _events: Event[] = [];

  private _event: Event;
  public eventChange: Subject<Event> = new Subject<Event>();

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
          const event = Event.createOfDTO(fetchedEvent);
          event.alreadyVotedFor = fetchedEvent.already_voted;
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

  public getEvent(id: number): Event {
    this.fetchEvent(id);
    return this._event;
  }

  public setEvent(event: Event) {
    this._event = event;
    this.eventChange.next(this._event);
  }

  private fetchEvent(id: number) {
    this.httpService.loggedInV1GETRequest('/avent/' + id, 'fetchSingleEvent').subscribe(
      (data: any) => {
        console.log(data);
        const response = data.event;

        const event = Event.createOfDTO(response);
        event.anonymous = response.resultGroups.anonymous;

        let resultUsers = [];
        for (const resultUser of response.resultGroups.allUsers) {
          resultUsers.push(
            new EventResultUser(
              resultUser.id,
              resultUser.firstname,
              resultUser.surname,
              resultUser.decisionId,
              resultUser.decision,
              resultUser.additional_information
            )
          );
        }
        event.setResultUsers(resultUsers);

        const data_resultGroups = response.resultGroups.groups;
        const resultGroups = [];
        for (const localResultGroup of data_resultGroups) {
          const resultGroup = new EventResultGroup(localResultGroup.id, localResultGroup.name);
          resultGroup.event = event;
          resultUsers = [];
          for (const localResultUser of localResultGroup.users) {
            resultUsers.push(
              new EventResultUser(
                localResultUser.id,
                localResultUser.firstname,
                localResultUser.surname,
                localResultUser.decisionId,
                localResultUser.decision,
                localResultUser.additional_information
              )
            );
          }
          resultGroup.setResultUsers(resultUsers);

          const resultSubgroups = [];
          for (const localResultSubgroup of localResultGroup.subgroups) {
            const resultSubgroup = new EventResultSubgroup(
              localResultSubgroup.id,
              localResultSubgroup.name,
              localResultSubgroup.parent_group_name
            );
            resultSubgroup.event = event;

            resultUsers = [];
            for (const localResultUser of localResultSubgroup.users) {
              resultUsers.push(
                new EventResultUser(
                  localResultUser.id,
                  localResultUser.firstname,
                  localResultUser.surname,
                  localResultUser.decisionId,
                  localResultUser.decision,
                  localResultUser.additional_information
                )
              );
            }

            resultSubgroup.setResultUsers(resultUsers);
            resultSubgroups.push(resultSubgroup);
          }

          resultGroup.setResultSubgroups(resultSubgroups);
          resultGroups.push(resultGroup);
        }

        event.setResultGroups(resultGroups);
        this.setEvent(event);
      },
      (error) => console.log(error)
    );
  }
}
