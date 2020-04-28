export class HomeBookingsModel {
  public readonly movieID: number;
  public readonly name: string;
  public readonly bookedTickets: number;
  public readonly date: Date;
  public workerID: number;
  public workerName: string;
  public emergencyWorkerID: number;
  public emergencyWorkerName: string;

  constructor(
    movieID: number,
    name: string,
    bookedTickets: number,
    date: Date,
    workerID: number,
    workerName: string,
    emergencyWorkerID: number,
    emergencyWorkerName: string
  ) {
    this.movieID = movieID;
    this.name = name;
    this.bookedTickets = bookedTickets;
    this.date = date;
    this.workerID = workerID;
    this.workerName = workerName;
    this.emergencyWorkerID = emergencyWorkerID;
    this.emergencyWorkerName = emergencyWorkerName;
  }

  public getUntil(): string {
    const date = new Date(this.date);
    date.setHours(21);

    const current = new Date();

    const days = Math.round((date.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.round(Math.abs(date.getTime() - current.getTime()) / (60 * 60 * 1000));
      return hours + 'h';
    } else {
      return days + 'd';
    }
  }
}
