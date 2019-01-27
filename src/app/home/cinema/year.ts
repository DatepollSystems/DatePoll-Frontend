export class Year {
  private _ID: number;
  private _year: string;

  constructor(_ID: number, _year: string) {
    this._ID = _ID;
    this._year = _year;
  }

  public getID() {
    return this._ID;
  }

  public getYear(): string {
    return this._year;
  }
}
