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

  public getExportResultUser(): any[] {
    const r = [];

    for (const user of this.resultUsers) {
      r.push({
        Vorname: user.firstname,
        Nachname: user.surname,
        Entscheidung: user.decision,
        Zusatz_Information: user.additionalInformation
      });
    }

    return r;
  }
}
