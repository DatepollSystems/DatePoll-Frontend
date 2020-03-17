import {Event} from './event.model';

export class Decision {
  public id: number;
  public decision: string;
  public showInCalendar: boolean;
  public color: string;
  public event: Event;

  constructor(id: number, decision: string, color: string) {
    this.id = id;
    this.decision = decision;
    this.color = color;
  }
}
