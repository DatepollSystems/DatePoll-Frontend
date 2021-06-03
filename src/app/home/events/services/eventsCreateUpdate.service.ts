import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../utils/helper/Converter';
import {HttpService} from '../../../utils/http.service';

import {Event} from '../models/event.model';
import {
  GroupAndSubgroupModel,
  GroupType,
} from '../../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';

@Injectable({
  providedIn: 'root',
})
export class EventsCreateUpdateService {
  private _joinedGroups: GroupAndSubgroupModel[] = [];
  public joinedGroupsChange: Subject<GroupAndSubgroupModel[]> = new Subject<GroupAndSubgroupModel[]>();

  private _freeGroups: GroupAndSubgroupModel[] = [];
  public freeGroupsChange: Subject<GroupAndSubgroupModel[]> = new Subject<GroupAndSubgroupModel[]>();

  constructor(private httpService: HttpService) {}

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
}
