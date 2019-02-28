export class HomeBookingsModel {
  private readonly _movieID: number;
  private readonly _name: string;
  private readonly _bookedTickets: number;
  private readonly _date: Date;
  private readonly _workerName: string;
  private readonly _emergencyWorkerName: string;

  constructor(movieID: number, name: string, bookedTickets: number, date: Date, workerName: string, emergencyWorkerName: string) {
    this._movieID = movieID;
    this._name = name;
    this._bookedTickets = bookedTickets;
    this._date = date;
    this._workerName = workerName;
    this._emergencyWorkerName = emergencyWorkerName;
  }

  public getMovieID(): number {
    return this._movieID;
  }

  public getName(): string {
    return this._name;
  }

  public getBookedTickets(): number {
    return this._bookedTickets;
  }

  public getDate(): Date {
    return this._date;
  }

  public getWorkerName(): string {
    return this._workerName;
  }

  public getEmergencyWorkerName(): string {
    return this._emergencyWorkerName;
  }
}
