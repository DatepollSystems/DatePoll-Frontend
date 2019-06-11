export class EventResultUser {
  public id: number;
  public firstname: string;
  public surname: string;
  public decision: string;

  constructor(id: number, firstname: string, surname: string, decision: string) {
    this.id = id;
    this.firstname = firstname;
    this.surname = surname;
    this.decision = decision;
  }
}
