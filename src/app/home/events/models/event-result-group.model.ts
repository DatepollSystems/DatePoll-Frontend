import {Event} from './event.model';
import {EventResultSubgroup} from './event-result-subgroup.model';
import {EventResultUser} from './event-result-user.model';
import {HasResultUsers} from './event-has-result-users.interface';

export class EventResultGroup extends HasResultUsers {
  public id: number;
  public name: string;
  public event: Event;
  private resultSubgroups: EventResultSubgroup[];

  constructor(id: number, name: string) {
    super();
    this.id = id;
    this.name = name;
  }

  public setResultSubgroups(subgroups: EventResultSubgroup[]) {
    this.resultSubgroups = subgroups;
  }

  public getResultSubgroups(): EventResultSubgroup[] {
    return this.resultSubgroups.slice();
  }
}
