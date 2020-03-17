export class EventStandardDecision {
  public id: number;
  public decision: string;
  public showInCalendar: boolean;
  public color: string;

  constructor(id: number, decision: string, showInCalendar: boolean, color: string) {
    this.id = id;
    this.decision = decision;
    this.showInCalendar = showInCalendar;
    this.color = color;
  }
}
