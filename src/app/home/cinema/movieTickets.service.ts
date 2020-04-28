import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../utils/http.service';

@Injectable({
  providedIn: 'root'
})
export class MovieTicketsService {
  public movieOrdersChange: Subject<MovieOrder[]> = new Subject<MovieOrder[]>();
  private _movieOrders: MovieOrder[];

  constructor(private httpService: HttpService) {}

  public setMovieOrders(movieOrders: MovieOrder[]) {
    this._movieOrders = movieOrders;
    this.movieOrdersChange.next(this._movieOrders.slice());
  }

  public getMovieOrders(): MovieOrder[] {
    this.fetchMovieOrders();
    if (this._movieOrders == null) {
      return null;
    }
    return this._movieOrders.slice();
  }

  public fetchMovieOrders() {
    this.httpService.loggedInV1GETRequest('/cinema/worker', 'fetchMovieOrders').subscribe(
      (completeData: any) => {
        const movies = completeData.movies;

        const movieOrdersToSave = [];
        for (let i = 0; i < movies.length; i++) {
          const localMovieOrder = new MovieOrder(movies[i].movie_id, movies[i].movie_name, movies[i].date);

          const ticketOrdersToSave = [];
          for (let j = 0; j < movies[i].orders.length; j++) {
            ticketOrdersToSave.push(
              new TicketOrder(movies[i].orders[j].user_id, movies[i].orders[j].user_name, movies[i].orders[j].amount)
            );
          }
          localMovieOrder.setTicketOrders(ticketOrdersToSave);
          movieOrdersToSave.push(localMovieOrder);
        }

        this.setMovieOrders(movieOrdersToSave);
      },
      error1 => console.log(error1)
    );
  }
}

export class MovieOrder {
  public movieID: number;
  public readonly movieName: string;
  public readonly date: Date;

  private _ticketOrders: TicketOrder[] = [];

  constructor(movieID: number, movieName: string, date: Date) {
    this.movieID = movieID;
    this.movieName = movieName;
    this.date = date;
  }

  public setTicketOrders(ticketOrders: TicketOrder[]) {
    this._ticketOrders = ticketOrders;
  }

  public getTicketOrders(): TicketOrder[] {
    return this._ticketOrders.slice();
  }
}

export class TicketOrder {
  public readonly userID: number;
  public readonly userName: string;
  public readonly amount: number;

  constructor(userID: number, userName: string, amount: number) {
    this.userID = userID;
    this.userName = userName;
    this.amount = amount;
  }
}
