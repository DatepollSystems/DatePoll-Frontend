export class EventStandardDecision {
  public id: number;
  public decision: string;
  public showInCalendar: boolean;

  constructor(id: number, decision: string, showInCalendar: boolean) {
    this.id = id;
    this.decision = decision;
    this.showInCalendar = showInCalendar;
  }
}
