export class Movie {
  private _ID: number;
  private _name: string;
  private _date: Date;
  private _trailerLink: string;
  private _posterLink: string;

  private _workerName: string;
  private _emergencyWorkerName: string;

  private _bookedTickets: number;

  private _bookedTicketsForYourself: number;

  private _movieYearID: number;

  constructor(ID: number, name: string, movieDate: Date, trailerLink: string, posterLink: string, workerName: string,
              emergencyWorkerName: string, bookedTickets: number, movieYearID: number) {
    this._ID = ID;
    this._name = name;
    this._date = movieDate;
    this._trailerLink = trailerLink;
    this._posterLink = posterLink;
    this._workerName = workerName;
    this._emergencyWorkerName = emergencyWorkerName;
    this._bookedTickets = bookedTickets;
    this._movieYearID = movieYearID;
  }

  public getID(): number {
    return this._ID;
  }

  public getName(): string {
    return this._name;
  }

  public getDate(): Date {
    return this._date;
  }

  public getTrailerlink(): string {
    return this._trailerLink;
  }

  public getImageLink(): string {
    return this._posterLink;
  }

  public getWorkerName(): string {
    return this._workerName;
  }

  public getEmergencyWorkerName(): string {
    return this._emergencyWorkerName;
  }

  public getBookedTickets(): number {
    return this._bookedTickets;
  }

  public setBookedTickets(bookedTickets: number) {
    this._bookedTickets = bookedTickets;
  }

  public getMovieYearID() {
    return this._movieYearID;
  }

  public setBookedTicketsForYourself(bookedTickets: number) {
    this._bookedTicketsForYourself = bookedTickets;
  }

  public getBookedTicketsForYourself(): number {
    return this._bookedTicketsForYourself;
  }
}
