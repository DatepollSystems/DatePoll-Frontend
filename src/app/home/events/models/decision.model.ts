import {Event} from './event.model';

export class Decision {
  public id: number;
  public decision: string;
  public showInCalendar: boolean;
  public event: Event;

  constructor(id: number, decision: string) {
    this.id = id;
    this.decision = decision;
  }
}
