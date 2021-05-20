import {Event} from './event.model';
import {HasResultUsers} from './event-has-result-users.interface';

export class EventResultSubgroup extends HasResultUsers {
  public id: number;
  public name: string;
  public parentGroupName: string;
  public event: Event;

  constructor(id: number, name: string, parentGroupName: string) {
    super();
    this.id = id;
    this.name = name;
    this.parentGroupName = parentGroupName;
  }
}
