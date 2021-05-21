import {EventAction} from 'calendar-utils';
import {EventDecision} from './event-decision.model';
import {EventDate} from './event-date.model';
import {EventResultGroup} from './event-result-group.model';
import {EventResultUser} from './event-result-user.model';
import {CalendarEvent} from 'angular-calendar';
import {UIHelper} from '../../../utils/helper/UIHelper';
import {Converter} from '../../../utils/helper/Converter';
import {HasResultUsers} from './event-has-result-users.interface';

export class Event extends HasResultUsers implements CalendarEvent {
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

  private decisions: EventDecision[] = [];
  private resultGroups: EventResultGroup[] = [];
  public anonymous = false;

  private dates: EventDate[] = [];

  constructor(
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    forEveryone: boolean,
    description: string,
    decisions: EventDecision[],
    dates: EventDate[]
  ) {
    super();
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

  public static createOfDTO(event: any): Event {
    const dates = [];
    for (const fetchedDate of event.dates) {
      dates.push(EventDate.createOfDTO(fetchedDate));
    }

    const decisions = [];
    for (const fetchedDecision of event.decisions) {
      decisions.push(EventDecision.createOfDTO(fetchedDecision));
    }

    return new Event(
      event.id,
      event.name,
      Converter.getIOSDate(event.start_date.toString()),
      Converter.getIOSDate(event.end_date.toString()),
      Converter.numberToBoolean(event.for_everyone),
      event.description,
      decisions,
      dates
    );
  }

  // ------------------------------------------------------

  public setResultGroups(groups: EventResultGroup[]) {
    this.resultGroups = groups;
  }

  public getResultGroups(): EventResultGroup[] {
    return this.resultGroups.slice();
  }

  public getDecisions(): EventDecision[] {
    return this.decisions.slice();
  }

  public getEventDates(): EventDate[] {
    return this.dates.slice();
  }

  public getUntil(): string {
    return UIHelper.getTimeLeft(this.startDate);
  }
}
