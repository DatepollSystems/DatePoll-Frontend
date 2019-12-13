export class EventResultUser {
  public id: number;
  public firstname: string;
  public surname: string;
  public additionalInformation: string;
  public decisionId: number;
  public decision: string;

  constructor(id: number, firstname: string, surname: string, decisionId: number, decision: string, additionalInformation: string) {
    this.id = id;
    this.firstname = firstname;
    this.surname = surname;
    this.decisionId = decisionId;
    this.decision = decision;
    this.additionalInformation = additionalInformation;
  }
}
