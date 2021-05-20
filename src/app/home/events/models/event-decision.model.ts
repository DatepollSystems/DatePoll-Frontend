import {Event} from './event.model';

export class EventDecision {
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

  public static createOfDTO(decision: any): EventDecision {
    return new EventDecision(decision.id, decision.decision, decision.color);
  }
}
