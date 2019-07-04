import {EventResultGroup} from './event-result-group.model';
import {EventResultUser} from './event-result-user.model';
import {EventAction} from 'calendar-utils';

export class Event {
  public id: number;
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public forEveryone: boolean;
  public description: string;
  public descriptionPreview = '';

  public alreadyVotedFor = false;
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
  resizable: { beforeStart: false; afterEnd: false };
  private decisions: string[];
  private resultGroups: EventResultGroup[] = [];
  private resultUsers: EventResultUser[] = [];
  private chartData: any[] = null;

  constructor(id: number, name: string, startDate: Date, endDate: Date, forEveryone: boolean, description: string, decisions: string[]) {
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
  }

  // ------------------------------------------------------

  public setResultGroups(groups: EventResultGroup[]) {
    this.resultGroups = groups;
  }

  public getResultGroups(): EventResultGroup[] {
    return this.resultGroups.slice();
  }

  public getDecisions(): string[] {
    return this.decisions.slice();
  }

  public setResultUsers(users: EventResultUser[]) {
    this.resultUsers = users;
  }

  public getChartData(): any[] {
    if (this.chartData == null) {
      this.calculateChartData();
    }

    return this.chartData;
  }

  private setDecisions(decisions: string[]) {
    this.decisions = decisions;
  }

  private getResultUsers(): EventResultUser[] {
    return this.resultUsers.slice();
  }

  private calculateChartData() {
    const data = [];
    for (let i = 0; i < this.getDecisions().length; i++) {
      const object = {
        'name': this.getDecisions()[i],
        'value': 0
      };
      data.push(object);
    }

    for (let i = 0; i < this.resultUsers.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].name === this.resultUsers[i].decision) {
          data[j].value++;
          this.chartIsEmpty = false;
          break;
        }
      }
    }
    const toReturn = [];

    for (let i = 0; i < data.length; i++) {
      toReturn.push(data[i].value);
    }
    this.chartData = toReturn;
  }
}
