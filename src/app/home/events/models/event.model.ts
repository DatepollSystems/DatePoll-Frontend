import {EventAction} from 'calendar-utils';
import {Decision} from './decision.model';
import {EventDate} from './event-date.model';
import {EventResultGroup} from './event-result-group.model';
import {EventResultUser} from './event-result-user.model';
import {CalendarEvent} from 'angular-calendar';
import {UIHelper} from '../../../utils/helper/UIHelper';

export class Event implements CalendarEvent {
  public id: number;
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public startDateWithOutHoursAndMinutes: Date;
  public endDateWithOutHoursAndMinutes: Date;
  public forEveryone: boolean;
  public description: string;
  public descriptionPreview = '';

  public alreadyVotedFor = false;
  public additionalInformation = null;
  public userDecision = null;
  public decisionColor: string;

  // Calendar specific values
  start: Date;
  end: Date;
  title: string;
  public actions: EventAction[];
  allDay = false;
  color = {
    primary: '#43A047',
    secondary: '#D1E8FF',
  };
  draggable: false;
  meta = null;
  resizable: {beforeStart: false; afterEnd: false};

  private decisions: Decision[] = [];
  private resultGroups: EventResultGroup[] = [];
  private resultUsers: EventResultUser[] = [];
  public anonymous = false;

  private dates: EventDate[] = [];

  constructor(
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    forEveryone: boolean,
    description: string,
    decisions: Decision[],
    dates: EventDate[]
  ) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.startDateWithOutHoursAndMinutes = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDay());
    this.endDate = endDate;
    this.endDateWithOutHoursAndMinutes = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDay());
    this.forEveryone = forEveryone;
    this.description = description;
    if (description != null) {
      if (description.length > 45) {
        this.descriptionPreview = this.description.slice(0, 45) + '...';
      } else {
        this.descriptionPreview = this.description;
      }
    }
    this.decisions = decisions;

    this.title = this.name;
    this.start = this.startDate;
    this.end = this.endDate;

    this.dates = dates;
  }

  // ------------------------------------------------------

  public setResultGroups(groups: EventResultGroup[]) {
    this.resultGroups = groups;
  }

  public getResultGroups(): EventResultGroup[] {
    return this.resultGroups.slice();
  }

  public getDecisions(): Decision[] {
    return this.decisions.slice();
  }

  public getEventDates(): EventDate[] {
    return this.dates.slice();
  }

  public setResultUsers(users: EventResultUser[]) {
    this.resultUsers = users;
  }

  public getResultUsers(): EventResultUser[] {
    return this.resultUsers.slice();
  }

  public getExportResultUser(): any[] {
    const r = [];

    for (const user of this.resultUsers) {
      r.push({
        Vorname: user.firstname,
        Nachname: user.surname,
        Entscheidung: user.decision,
        Zusatz_Information: user.additionalInformation,
      });
    }

    return r;
  }

  public getUntil(): string {
    const currentDate = UIHelper.getCurrentDate();

    const days = Math.round((this.startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.round(Math.abs(this.startDate.getTime() - currentDate.getTime()) / (60 * 60 * 1000));
      return hours + 'h';
    } else {
      return days + 'd';
    }
  }
}
