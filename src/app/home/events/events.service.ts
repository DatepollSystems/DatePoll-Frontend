import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../utils/helper/Converter';
import {HttpService} from '../../utils/http.service';

import {EventDecision} from './models/event-decision.model';
import {EventResultUser} from './models/event-result-user.model';
import {Event} from './models/event.model';
import {GroupAndSubgroupModel, GroupType} from '../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private _events: Event[] = [];
  public eventsChange: Subject<Event[]> = new Subject<Event[]>();

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
        const fetchedEvents = data.data;
        for (const fetchedEvent of fetchedEvents) {
          events.push(Event.createOfDTO(fetchedEvent));
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

  private setJoinedOfEvent(groups: GroupAndSubgroupModel[]) {
    this._joinedGroups = groups;
    this.joinedGroupsChange.next(this._joinedGroups.slice());
  }

  private setFreeOfEvent(groups: GroupAndSubgroupModel[]) {
    this._freeGroups = groups;
    this.freeGroupsChange.next(this._freeGroups.slice());
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
