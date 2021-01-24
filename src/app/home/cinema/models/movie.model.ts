import {CalendarEvent} from 'angular-calendar';
import {EventAction} from 'calendar-utils';
import {UIHelper} from '../../../utils/helper/UIHelper';

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
  public maximalTickets: number;

  public bookedTicketsForYourself: number;

  public movieYearID: number;
  // Calendar specific values
  start: Date;
  title: string;
  public actions: EventAction[];
  allDay = false;
  color = {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  };
  draggable: false;
  end: null;
  meta = null;
  resizable: {beforeStart: false; afterEnd: false};

  private bookingUsers: MovieBookingUser[] = [];

  private weatherForecasts: WeatherForecast[] = [];

  constructor(
    id: number,
    name: string,
    movieDate: Date,
    trailerLink: string,
    posterLink: string,
    workerID: number,
    workerName: string,
    emergencyWorkerID: number,
    emergencyWorkerName: string,
    bookedTickets: number,
    maximalTickets: number
  ) {
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
    this.maximalTickets = maximalTickets;

    this.start = movieDate;
    this.start.setHours(20);
    this.start.setMinutes(30);
    this.title = name;
  }

  public setBookingsUsers(bookingUsers: MovieBookingUser[]) {
    this.bookingUsers = bookingUsers;
  }

  public getBookingUsers(): MovieBookingUser[] {
    return this.bookingUsers.slice();
  }

  public setWeatherforecasts(weatherForecasts: WeatherForecast[]) {
    this.weatherForecasts = weatherForecasts;
  }

  public getWeatherForecasts(): WeatherForecast[] {
    return this.weatherForecasts;
  }

  public getUntil(): string {
    const date = new Date(this.date);
    date.setHours(21);

    return UIHelper.getTimeLeft(date);
  }
}

export class MovieBookingUser {
  public readonly userID: number;
  public readonly firstname: string;
  public readonly surname: string;
  public amount: number;

  constructor(userID: number, firstname: string, surname: string, amount: number) {
    this.userID = userID;
    this.firstname = firstname;
    this.surname = surname;
    this.amount = amount;
  }
}

export class WeatherForecast {
  public readonly temperature: number;
  public readonly weather: string;
  public readonly cloudy: number;
  public readonly windSpeed: number;
  public readonly windDirection: number;
  public readonly date: Date;

  constructor(temperature: number, weather: string, cloudy: number, windSpeed: number, windDirection: number, date: Date) {
    this.temperature = temperature;
    this.weather = weather;
    this.cloudy = cloudy;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.date = date;
  }
}
