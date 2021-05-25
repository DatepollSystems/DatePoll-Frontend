import {EventResultUser} from './event-result-user.model';

export abstract class HasResultUsers {
  protected resultUsers: EventResultUser[];
  public chart: any[];

  public setResultUsers(users: EventResultUser[]) {
    this.resultUsers = users;
  }

  public getResultUsers(): EventResultUser[] {
    return this.resultUsers.slice();
  }
}
