import {EventAction} from 'calendar-utils';
import {Decision} from './decision.model';
import {EventDate} from './event-date.model';
import {EventResultGroup} from './event-result-group.model';
import {EventResultUser} from './event-result-user.model';

export class Event {
  public id: number;
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public forEveryone: boolean;
  public description: string;
  public descriptionPreview = '';

  public alreadyVotedFor = false;
  public additionalInformation = null;
  public userDecision = null;
  public decisionColor: string;

  public chartIsEmpty = true;
  // Calendar specific values
  start: Date;
  end: Date;
  title: string;
  public actions: EventAction[];
  allDay = false;
  color = {
    primary: '#43A047',
    secondary: '#D1E8FF'
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
    this.endDate = endDate;
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

  public getDecisionsAsStrings(): string[] {
    const decisions = [];
    for (const decision of this.decisions) {
      decisions.push(decision.decision);
    }
    return decisions;
  }

  public setResultUsers(users: EventResultUser[]) {
    this.resultUsers = users;
  }

  public getResultUsers(): EventResultUser[] {
    return this.resultUsers.slice();
  }

  private setDecisions(decisions: Decision[]) {
    this.decisions = decisions;
  }

  public getUntil(): string {
    const current = new Date();

    const days = Math.round((this.startDate.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.round(Math.abs(this.startDate.getTime() - current.getTime()) / (60 * 60 * 1000));
      return hours + 'h';
    } else {
      return days + 'd';
    }
  }
}
