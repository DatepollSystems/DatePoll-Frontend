export class HomeBirthdayModel {
  private readonly _name: string;
  private readonly _date: Date;

  constructor(name: string, date: Date) {
    this._name = name;
    this._date = date;
  }

  public getName(): string {
    return this._name;
  }

  public getDate(): Date {
    return this._date;
  }
}
