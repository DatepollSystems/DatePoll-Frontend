import {Event} from './event.model';
import {Converter} from '../../../utils/helper/Converter';

export class EventDecision {
  public id: number;
  public decision: string;
  public showInCalendar: boolean;
  public color: string;
  public event: Event;

  constructor(id: number, decision: string, color: string, showInCalendar: boolean) {
    this.id = id;
    this.decision = decision;
    this.color = color;
    this.showInCalendar = showInCalendar;
  }

  public static createOfDTO(decision: any): EventDecision {
    return new EventDecision(decision.id, decision.decision, decision.color, Converter.numberToBoolean(decision.show_in_calendar));
  }
}
