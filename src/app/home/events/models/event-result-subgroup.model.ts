import {EventResultUser} from './event-result-user.model';
import {Event} from './event.model';

export class EventResultSubgroup {
  public id: number;
  public name: string;
  public parentGroupName: string;
  private resultUsers: EventResultUser[] = [];
  public event: Event;
  private chartData: any[] = null;
  public chartIsEmpty = true;

  constructor(id: number, name: string, parentGroupName: string) {
    this.id = id;
    this.name = name;
    this.parentGroupName = parentGroupName;
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
