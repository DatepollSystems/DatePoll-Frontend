import {Event} from './event.model';
import {EventResultSubgroup} from './event-result-subgroup.model';
import {EventResultUser} from './event-result-user.model';

export class EventResultGroup {
  public id: number;
  public name: string;
  public event: Event;
  public chartIsEmpty = true;
  private resultSubgroups: EventResultSubgroup[];
  private resultUsers: EventResultUser[];
  private chartData: any[] = null;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public setResultSubgroups(subgroups: EventResultSubgroup[]) {
    this.resultSubgroups = subgroups;
  }

  public getResultSubgroups(): EventResultSubgroup[] {
    return this.resultSubgroups.slice();
  }

  public setResultUsers(users: EventResultUser[]) {
    this.resultUsers = users;
  }

  public getResultUsers(): EventResultUser[] {
    return this.resultUsers.slice();
  }

  public getChartData(): any[] {
    if (this.chartData == null) {
      this.calculateChartData();
    }

    return this.chartData;
  }

  private calculateChartData() {
    const data = [];
    for (let i = 0; i < this.event.getDecisions().length; i++) {
      const object = {
        'name': this.event.getDecisions()[i],
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
