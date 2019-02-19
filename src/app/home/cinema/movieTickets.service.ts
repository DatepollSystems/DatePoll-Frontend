import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {error} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class MovieTicketsService {
  private _movieOrders: MovieOrder[] = [];
  public movieOrdersChange: Subject<MovieOrder[]> = new Subject<MovieOrder[]>();

  constructor(private httpService: HttpService) { }

  public setMovieOrders(movieOrders: MovieOrder[]) {
    this._movieOrders = movieOrders;
    this.movieOrdersChange.next(this._movieOrders.slice());
  }

  public getMovieOrders(): MovieOrder[] {
    this.fetchMovieOrders();
    return this._movieOrders.slice();
  }

  public fetchMovieOrders() {
    this.httpService.loggedInV1GETRequest( '/cinema/worker', 'fetchMovieOrders').subscribe(
      (completeData: any) => {
        const movies = completeData.movies;

        const movieOrdersToSave = [];
        for (let i = 0; i < movies.length; i++) {
          const localMovieOrder = new MovieOrder(movies[i].movieID, movies[i].movieName, movies[i].amount);

          const ticketOrdersToSave = [];
          for (let j = 0; j < movies[i].orders.length; j++) {
            ticketOrdersToSave.push(new TicketOrder(movies[i].orders[j].userID, movies[i].orders[j].userName, movies[i].orders[j].amount));
          }
          localMovieOrder.setTicketOrders(ticketOrdersToSave);
          movieOrdersToSave.push(localMovieOrder);
        }

        this.setMovieOrders(movieOrdersToSave);
      },
      (error1) => console.log(error1)
    );
  }
}

export class MovieOrder {
  private _movieID: number;
  private readonly _movieName: string;
  private readonly _date: Date;

  private _ticketOrders: TicketOrder[] = [];

  constructor(movieID: number, movieName: string, date: Date) {
    this._movieID = movieID;
    this._movieName = movieName;
    this._date = date;
  }

  public getMovieName(): string {
    return this._movieName;
  }

  public getDate(): Date {
    return this._date;
  }

  public setTicketOrders(ticketOrders: TicketOrder[]) {
    this._ticketOrders = ticketOrders;
  }

  public getTicketOrders(): TicketOrder[] {
    return this._ticketOrders.slice();
  }
}

export class TicketOrder {
  private readonly _userID: number;
  private readonly _userName: string;
  private readonly _amount: number;

  constructor(userID: number, userName: string, amount: number) {
    this._userID = userID;
    this._userName = userName;
    this._amount = amount;
  }

  public getUserID(): number {
    return this._userID;
  }

  public getUserName(): string {
    return this._userName;
  }

  public getAmount(): number {
    return this._amount;
  }
}
