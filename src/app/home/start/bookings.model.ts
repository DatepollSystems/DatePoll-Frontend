export class HomeBookingsModel {
  public readonly movieID: number;
  public readonly name: string;
  public readonly bookedTickets: number;
  public readonly date: Date;
  public readonly workerID: number;
  public readonly workerName: string;
  public readonly emergencyWorkerID: number;
  public readonly emergencyWorkerName: string;

  constructor(movieID: number, name: string, bookedTickets: number, date: Date, workerID: number, workerName: string,
              emergencyWorkerID: number, emergencyWorkerName: string) {
    this.movieID = movieID;
    this.name = name;
    this.bookedTickets = bookedTickets;
    this.date = date;
    this.workerID = workerID;
    this.workerName = workerName;
    this.emergencyWorkerID = emergencyWorkerID;
    this.emergencyWorkerName = emergencyWorkerName;
  }
}
