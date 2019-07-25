import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Subject} from 'rxjs';
import {Event} from './models/event.model';
import {Converter} from '../../services/converter';
import {EventResultGroup} from './models/event-result-group.model';
import {EventResultSubgroup} from './models/event-result-subgroup.model';
import {EventResultUser} from './models/event-result-user.model';
import {Decision} from './models/decision.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  public eventsChange: Subject<Event[]> = new Subject<Event[]>();
  public eventChange: Subject<Event> = new Subject<Event>();
  public joinedGroupsChange: Subject<any[]> = new Subject<any[]>();
  public freeGroupsChange: Subject<any[]> = new Subject<any[]>();
  private _events: Event[] = [];
  private _event: Event;
  private _joinedGroups: any[] = [];
  private _freeGroups: any[] = [];

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
    this.httpService.loggedInV1GETRequest('/avent/administration/avent', 'fetchEvents').subscribe(
      (data: any) => {
        console.log(data);

        const events = [];
        const fetchedEvents = data.events;
        for (let i = 0; i < fetchedEvents.length; i++) {
          const fetchedEvent = fetchedEvents[i];

          const decisions = [];
          for (const fetchedDecision of fetchedEvent.decisions) {
            const decision = new Decision(fetchedDecision.id, fetchedDecision.decision);
            decision.showInCalendar = fetchedDecision.showInCalendar;
            decisions.push(decision);
          }

          events.push(new Event(fetchedEvent.id, fetchedEvent.name, new Date(fetchedEvent.startDate), new Date(fetchedEvent.endDate),
            fetchedEvent.forEveryone, fetchedEvent.description, fetchedEvent.location, decisions));
        }

        this.setEvents(events);
      },
      (error) => console.log(error)
    );
  }

  public createEvent(event: Event) {
    const decisions = [];
    for (const decision of event.getDecisions()) {
      decisions.push({
        'decision': decision.decision,
        'showInCalendar': decision.showInCalendar
      });
    }
    const object = {
      'name': event.name,
      'startDate': Converter.getDateFormattedWithHoursMinutesAndSeconds(event.startDate),
      'endDate': Converter.getDateFormattedWithHoursMinutesAndSeconds(event.endDate),
      'forEveryone': event.forEveryone,
      'description': event.description,
      'location': event.location,
      'decisions': decisions
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/avent', object, 'createEvent');
  }

  public updateEvent(event: Event) {
    const object = {
      'name': event.name,
      'startDate': Converter.getDateFormattedWithHoursMinutesAndSeconds(event.startDate),
      'endDate': Converter.getDateFormattedWithHoursMinutesAndSeconds(event.endDate),
      'forEveryone': event.forEveryone,
      'description': event.description,
      'location': event.location,
      'decisions': event.getDecisions()
    };

    return this.httpService.loggedInV1PUTRequest('/avent/administration/avent/' + event.id, object, 'updateEvent');
  }

  public deleteEvent(id: number) {
    return this.httpService.loggedInV1DELETERequest('/avent/administration/avent/' + id, 'deleteEvent');
  }


  public addGroupToEvent(eventId: number, groupId: number) {
    const dto = {
      'event_id': eventId,
      'group_id': groupId
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/addGroupToEvent', dto, 'addGroupToEvent');
  }

  public addSubgroupToEvent(eventId: number, subgroupId: number) {
    const dto = {
      'event_id': eventId,
      'subgroup_id': subgroupId
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/addSubgroupToEvent', dto, 'addSubgroupToEvent');
  }

  public removeGroupFromEvent(eventId: number, groupId: number) {
    const dto = {
      'event_id': eventId,
      'group_id': groupId
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/removeGroupFromEvent', dto, 'removeGroupFromEvent');
  }

  public removeSubgroupFromEvent(eventId: number, subgroupId: number) {
    const dto = {
      'event_id': eventId,
      'subgroup_id': subgroupId
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/removeSubgroupFromEvent', dto, 'removeSubgroupFromEvent');
  }


  public getJoinedOfEvent(eventId: number): any[] {
    this.fetchJoinedOfEvent(eventId);
    return this._joinedGroups.slice();
  }

  public fetchJoinedOfEvent(eventId: number) {
    this.httpService.loggedInV1GETRequest('/avent/administration/group/joined/' + eventId, 'fetchJoinedGroupsOfEvent').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];

        const groupsDTO = data.groups;
        for (let i = 0; i < groupsDTO.length; i++) {
          const groupDTO = groupsDTO[i];

          const groupObject = {
            'id': groupDTO.id,
            'name': groupDTO.name,
            'type': 'parentgroup'
          };

          groups.push(groupObject);
        }

        this.httpService.loggedInV1GETRequest('/avent/administration/subgroup/joined/' + eventId, 'fetchJoinedSubgroupsOfEvent').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            const subgroupsDTO = subgroupData.subgroups;
            for (let i = 0; i < subgroupsDTO.length; i++) {
              const subgroupDTO = subgroupsDTO[i];

              const subgroupObject = {
                'id': subgroupDTO.id,
                'name': subgroupDTO.name,
                'type': 'subgroup',
                'group_id': subgroupDTO.group_id,
                'group_name': subgroupDTO.group_name
              };

              groups.push(subgroupObject);
            }

            this.setJoinedOfEvent(groups);
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }

  public getFreeOfEvent(eventId: number): any[] {
    this.fetchFreeOfEvent(eventId);
    return this._freeGroups.slice();
  }

  public fetchFreeOfEvent(eventId: number) {
    this.httpService.loggedInV1GETRequest('/avent/administration/group/free/' + eventId, 'fetchFreeGroupsOfEvent').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];

        const groupsDTO = data.groups;
        for (let i = 0; i < groupsDTO.length; i++) {
          const groupDTO = groupsDTO[i];

          const groupObject = {
            'id': groupDTO.id,
            'name': groupDTO.name,
            'type': 'parentgroup'
          };

          groups.push(groupObject);
        }

        this.httpService.loggedInV1GETRequest('/avent/administration/subgroup/free/' + eventId, 'fetchFreeSubgroupsOfEvent').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            const subgroupsDTO = subgroupData.subgroups;
            for (let i = 0; i < subgroupsDTO.length; i++) {
              const subgroupDTO = subgroupsDTO[i];

              const subgroupObject = {
                'id': subgroupDTO.id,
                'name': subgroupDTO.name,
                'type': 'subgroup',
                'group_id': subgroupDTO.group_id,
                'group_name': subgroupDTO.group_name
              };

              groups.push(subgroupObject);
            }

            this.setFreeOfEvent(groups);
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }

  public getEvent(id: number): Event {
    this.fetchEvent(id);
    return this._event;
  }

  public setEvent(event: Event) {
    this._event = event;
    this.eventChange.next(this._event);
  }

  private setJoinedOfEvent(groups: any[]) {
    this._joinedGroups = groups;
    this.joinedGroupsChange.next(this._joinedGroups.slice());
  }

  private setFreeOfEvent(groups: any[]) {
    this._freeGroups = groups;
    this.freeGroupsChange.next(this._freeGroups.slice());
  }

  private fetchEvent(id: number) {
    this.httpService.loggedInV1GETRequest('/avent/' + id, 'fetchSingleEvent').subscribe(
      (data: any) => {
        console.log(data);
        const response = data.event;

        const decisions = [];
        for (const fetchedDecision of response.decisions) {
          const decision = new Decision(fetchedDecision.id, fetchedDecision.decision);
          decision.showInCalendar = fetchedDecision.showInCalendar;
          decisions.push(decision);
        }

        const event = new Event(response.id, response.name, new Date(response.startDate), new Date(response.endDate),
          response.forEveryone, response.description, response.location, decisions);

        let resultUsers = [];
        for (let i = 0; i < response.resultGroups.allUsers.length; i++) {
          const resultUser = response.resultGroups.allUsers[i];
          resultUsers.push(new EventResultUser(resultUser.id, resultUser.firstname, resultUser.surname, resultUser.decisionId,
            resultUser.decision));
        }
        event.setResultUsers(resultUsers);

        const data_resultGroups = response.resultGroups.groups;
        const resultGroups = [];
        for (let i = 0; i < data_resultGroups.length; i++) {
          const localResultGroup = data_resultGroups[i];

          const resultGroup = new EventResultGroup(localResultGroup.id, localResultGroup.name);
          resultGroup.event = event;
          resultUsers = [];
          for (let j = 0; j < localResultGroup.users.length; j++) {
            const localResultUser = localResultGroup.users[j];

            resultUsers.push(new EventResultUser(localResultUser.id, localResultUser.firstname, localResultUser.surname,
              localResultUser.decisionId, localResultUser.decision));
          }
          resultGroup.setResultUsers(resultUsers);

          const resultSubgroups = [];
          for (let j = 0; j < localResultGroup.subgroups.length; j++) {
            const localResultSubgroup = localResultGroup.subgroups[j];

            const resultSubgroup = new EventResultSubgroup(localResultSubgroup.id, localResultSubgroup.name,
              localResultSubgroup.parent_group_name);
            resultSubgroup.event = event;

            resultUsers = [];
            for (let x = 0; x < localResultSubgroup.users.length; x++) {
              const localResultUser = localResultSubgroup.users[x];

              resultUsers.push(new EventResultUser(localResultUser.id, localResultUser.firstname, localResultUser.surname,
                localResultUser.decisionId, localResultUser.decision));
            }

            resultSubgroup.setResultUsers(resultUsers);
            resultSubgroup.getChartData();
            resultSubgroups.push(resultSubgroup);
          }

          resultGroup.setResultSubgroups(resultSubgroups);
          resultGroup.getChartData();
          resultGroups.push(resultGroup);
        }

        event.setResultGroups(resultGroups);
        this.setEvent(event);
      },
      (error) => console.log(error)
    );
  }
}
