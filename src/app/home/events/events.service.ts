import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../utils/helper/Converter';
import {HttpService} from '../../utils/http.service';

import {Decision} from './models/decision.model';
import {EventDate} from './models/event-date.model';
import {EventResultGroup} from './models/event-result-group.model';
import {EventResultSubgroup} from './models/event-result-subgroup.model';
import {EventResultUser} from './models/event-result-user.model';
import {Event} from './models/event.model';
import {GroupAndSubgroupModel, GroupType} from '../../utils/models/groupAndSubgroup.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private _events: Event[] = [];
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();

  private _event: Event;
  public eventChange: Subject<Event> = new Subject<Event>();

  private _joinedGroups: GroupAndSubgroupModel[] = [];
  public joinedGroupsChange: Subject<GroupAndSubgroupModel[]> = new Subject<GroupAndSubgroupModel[]>();

  private _freeGroups: GroupAndSubgroupModel[] = [];
  public freeGroupsChange: Subject<GroupAndSubgroupModel[]> = new Subject<GroupAndSubgroupModel[]>();

  private _lastUsedYear: number;
  private _years: string[] = [];
  public yearsChange: Subject<string[]> = new Subject<string[]>();

  constructor(public httpService: HttpService) {}

  public getYears(): string[] {
    this.fetchYears();
    return this._years.slice();
  }

  public setYears(years: string[]) {
    this._years = years;
    this.yearsChange.next(this._years.slice());
  }

  private fetchYears() {
    this.httpService.loggedInV1GETRequest('/avent/administration/avent/years').subscribe(
      (response: any) => {
        console.log(response);
        const years = [];
        for (const year of response.years) {
          years.push(year.toString());
        }
        this.setYears(years);
      },
      (error) => console.log(error)
    );
  }

  public getEvents(year: number = null): Event[] {
    this._lastUsedYear = year;
    this.fetchEvents(year);
    return this._events.slice();
  }

  public setEvents(events: Event[]) {
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
    }
    this.httpService.loggedInV1GETRequest(url, 'fetchEvents').subscribe(
      (data: any) => {
        console.log(data);

        const events = [];
        const fetchedEvents = data.events;
        for (const fetchedEvent of fetchedEvents) {
          const decisions = [];
          for (const fetchedDecision of fetchedEvent.decisions) {
            const decision = new Decision(fetchedDecision.id, fetchedDecision.decision, fetchedDecision.color);
            decision.showInCalendar = fetchedDecision.show_in_calendar;
            decisions.push(decision);
          }

          const dates = [];
          for (const fetchedDate of fetchedEvent.dates) {
            const date = new EventDate(
              fetchedDate.id,
              fetchedDate.location,
              fetchedDate.x,
              fetchedDate.y,
              Converter.getIOSDate(fetchedDate.date.toString()),
              fetchedDate.description
            );
            dates.push(date);
          }

          events.push(
            new Event(
              fetchedEvent.id,
              fetchedEvent.name,
              Converter.getIOSDate(fetchedEvent.start_date.toString()),
              Converter.getIOSDate(fetchedEvent.end_date.toString()),
              fetchedEvent.for_everyone,
              fetchedEvent.description,
              decisions,
              dates
            )
          );
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
        id: -1,
        decision: decision.decision,
        show_in_calendar: decision.showInCalendar,
        color: decision.color,
      });
    }
    const dates = [];
    for (const date of event.getEventDates()) {
      dates.push({
        id: -1,
        x: date.x,
        y: date.y,
        date: Converter.getDateFormattedWithHoursMinutesAndSeconds(date.date),
        location: date.location,
        description: date.description,
      });
    }
    const object = {
      name: event.name,
      startDate: Converter.getDateFormattedWithHoursMinutesAndSeconds(event.startDate),
      endDate: Converter.getDateFormattedWithHoursMinutesAndSeconds(event.endDate),
      forEveryone: event.forEveryone,
      description: event.description,
      decisions,
      dates,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/avent', object, 'createEvent');
  }

  public updateEvent(event: Event) {
    const decisions = [];
    for (const decision of event.getDecisions()) {
      decisions.push({
        id: decision.id,
        decision: decision.decision,
        show_in_calendar: decision.showInCalendar,
        color: decision.color,
      });
    }
    const dates = [];
    for (const date of event.getEventDates()) {
      dates.push({
        id: date.id,
        x: date.x,
        y: date.y,
        date: Converter.getDateFormattedWithHoursMinutesAndSeconds(date.date),
        location: date.location,
        description: date.description,
      });
    }
    const object = {
      name: event.name,
      forEveryone: event.forEveryone,
      description: event.description,
      decisions,
      dates,
    };

    return this.httpService.loggedInV1PUTRequest('/avent/administration/avent/' + event.id, object, 'updateEvent');
  }

  public deleteEvent(id: number) {
    return this.httpService.loggedInV1DELETERequest('/avent/administration/avent/' + id, 'deleteEvent');
  }

  public addGroupToEvent(eventId: number, groupId: number) {
    const dto = {
      event_id: eventId,
      group_id: groupId,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/addGroupToEvent', dto, 'addGroupToEvent');
  }

  public addSubgroupToEvent(eventId: number, subgroupId: number) {
    const dto = {
      event_id: eventId,
      subgroup_id: subgroupId,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/addSubgroupToEvent', dto, 'addSubgroupToEvent');
  }

  public removeGroupFromEvent(eventId: number, groupId: number) {
    const dto = {
      event_id: eventId,
      group_id: groupId,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/removeGroupFromEvent', dto, 'removeGroupFromEvent');
  }

  public removeSubgroupFromEvent(eventId: number, subgroupId: number) {
    const dto = {
      event_id: eventId,
      subgroup_id: subgroupId,
    };

    return this.httpService.loggedInV1POSTRequest('/avent/administration/removeSubgroupFromEvent', dto, 'removeSubgroupFromEvent');
  }

  public getJoinedOfEvent(eventId: number): GroupAndSubgroupModel[] {
    this.fetchJoinedOfEvent(eventId);
    return this._joinedGroups.slice();
  }

  public fetchJoinedOfEvent(eventId: number) {
    this.httpService.loggedInV1GETRequest('/avent/administration/group/joined/' + eventId, 'fetchJoinedGroupsOfEvent').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];
        for (const groupDTO of data.groups) {
          const group = new GroupAndSubgroupModel(groupDTO.id, groupDTO.name, GroupType.PARENTGROUP);
          groups.push(group);
        }

        this.httpService.loggedInV1GETRequest('/avent/administration/subgroup/joined/' + eventId, 'fetchJoinedSubgroupsOfEvent').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            for (const subgroupDTO of subgroupData.subgroups) {
              const subgroup = new GroupAndSubgroupModel(subgroupDTO.id, subgroupDTO.name, GroupType.SUBGROUP);
              subgroup.groupId = subgroupDTO.group_id;
              subgroup.groupName = subgroupDTO.group_name;
              groups.push(subgroup);
            }

            this.setJoinedOfEvent(groups);
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }

  public getFreeOfEvent(eventId: number): GroupAndSubgroupModel[] {
    this.fetchFreeOfEvent(eventId);
    return this._freeGroups.slice();
  }

  public fetchFreeOfEvent(eventId: number) {
    this.httpService.loggedInV1GETRequest('/avent/administration/group/free/' + eventId, 'fetchFreeGroupsOfEvent').subscribe(
      (data: any) => {
        console.log(data);

        const groups = [];
        for (const groupDTO of data.groups) {
          const group = new GroupAndSubgroupModel(groupDTO.id, groupDTO.name, GroupType.PARENTGROUP);
          groups.push(group);
        }

        this.httpService.loggedInV1GETRequest('/avent/administration/subgroup/free/' + eventId, 'fetchFreeSubgroupsOfEvent').subscribe(
          (subgroupData: any) => {
            console.log(subgroupData);

            for (const subgroupDTO of subgroupData.subgroups) {
              const subgroup = new GroupAndSubgroupModel(subgroupDTO.id, subgroupDTO.name, GroupType.SUBGROUP);
              subgroup.groupId = subgroupDTO.group_id;
              subgroup.groupName = subgroupDTO.group_name;
              groups.push(subgroup);
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

  private setJoinedOfEvent(groups: GroupAndSubgroupModel[]) {
    this._joinedGroups = groups;
    this.joinedGroupsChange.next(this._joinedGroups.slice());
  }

  private setFreeOfEvent(groups: GroupAndSubgroupModel[]) {
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
          const decision = new Decision(fetchedDecision.id, fetchedDecision.decision, fetchedDecision.color);
          decision.showInCalendar = fetchedDecision.show_in_calendar;
          decisions.push(decision);
        }

        const dates = [];
        for (const fetchedDate of response.dates) {
          const date = new EventDate(
            fetchedDate.id,
            fetchedDate.location,
            fetchedDate.x,
            fetchedDate.y,
            Converter.getIOSDate(fetchedDate.date.toString()),
            fetchedDate.description
          );
          dates.push(date);
        }

        const event = new Event(
          response.id,
          response.name,
          Converter.getIOSDate(response.start_date.toString()),
          Converter.getIOSDate(response.end_date.toString()),
          response.for_everyone,
          response.description,
          decisions,
          dates
        );
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

  public voteForUsers(event: Event, decision: Decision, additionalInformation: string, users: EventResultUser[]) {
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
