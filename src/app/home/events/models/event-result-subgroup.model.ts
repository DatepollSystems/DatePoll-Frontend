import {EventResultUser} from './event-result-user.model';
import {Event} from './event.model';

export class EventResultSubgroup {
  public id: number;
  public name: string;
  public parentGroupName: string;
  public event: Event;
  private resultUsers: EventResultUser[] = [];

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
}
