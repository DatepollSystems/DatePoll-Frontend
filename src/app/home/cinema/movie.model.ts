import {CalendarEvent} from 'angular-calendar';
import {EventAction} from 'calendar-utils';

export class Movie implements CalendarEvent {
  public id: number;
  public name: string;
  public date: Date;
  public trailerLink: string;
  public posterLink: string;

  public workerID: number;
  public workerName: string;
  public emergencyWorkerID: number;
  public emergencyWorkerName: string;

  public bookedTickets: number;

  public bookedTicketsForYourself: number;

  public movieYearID: number;

  constructor(id: number, name: string, movieDate: Date, trailerLink: string, posterLink: string, workerID: number, workerName: string,
              emergencyWorkerID: number, emergencyWorkerName: string, bookedTickets: number, movieYearID: number) {
    this.id = id;
    this.name = name;
    this.date = movieDate;
    this.trailerLink = trailerLink;
    this.posterLink = posterLink;
    this.workerID = workerID;
    this.workerName = workerName;
    this.emergencyWorkerID = emergencyWorkerID;
    this.emergencyWorkerName = emergencyWorkerName;
    this.bookedTickets = bookedTickets;
    this.movieYearID = movieYearID;

    this.start = movieDate;
    this.title = name;
  }

  start: Date;
  title: string;

  public actions: EventAction[];

  allDay = false;
  color = {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  };
  draggable: false;

  end: null;

  meta = null;
  resizable: { beforeStart: false; afterEnd: false };

}
