import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../utils/http.service';
import {Movie, MovieBookingUser} from './models/movie.model';
import {Converter} from '../../utils/helper/Converter';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private _movies: Movie[] = [];
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _lastUsedYear: number;
  private _years: string[] = [];
  public yearsChange: Subject<string[]> = new Subject<string[]>();

  private _movie: Movie;
  public movieChange: Subject<Movie> = new Subject<Movie>();

  constructor(private authService: AuthService, private httpService: HttpService) {}

  public getYears(): string[] {
    this.fetchYears();
    return this._years.slice();
  }

  public setYears(years: string[]) {
    this._years = years;
    this.yearsChange.next(this._years.slice());
  }

  private fetchYears() {
    this.httpService.loggedInV1GETRequest('/cinema/administration/movie/years').subscribe(
      (response: any) => {
        console.log(response);
        const years = [];
        for (const year of response.years) {
          years.push(year.toString());
        }
        this.setYears(years);
      },
      (error) => console.log(error)
    );
  }

  public addMovie(movie: any) {
    return this.httpService.loggedInV1POSTRequest('/cinema/administration/movie', movie, 'addMovie');
  }

  public updateMovie(movieID: number, movie: any) {
    return this.httpService.loggedInV1PUTRequest('/cinema/administration/movie/' + movieID, movie, 'updateMovie');
  }

  public deleteMovie(movieID: number) {
    return this.httpService.loggedInV1DELETERequest('/cinema/administration/movie/' + movieID, 'deleteMovie');
  }

  public getMovies(year: number): Movie[] {
    this._lastUsedYear = year;
    this.fetchMovies(year);
    return this._movies.slice();
  }

  public setMovies(movies: Movie[]) {
    this._movies = movies;
    this.moviesChange.next(this._movies.slice());
  }

  public fetchMovies(year: number = null) {
    if (this._lastUsedYear != null) {
      year = this._lastUsedYear;
    }
    let url = '/cinema/administration/movie';
    if (year != null) {
      url += '/' + year;
    }

    this.httpService.loggedInV1GETRequest(url, 'fetchMovies').subscribe(
      (response: any) => {
        console.log(response);

        const fetchedMovies = response.data;

        const movies = [];
        for (const movie of fetchedMovies) {
          let workerID = -1;
          let emergencyWorkerID = -1;

          if (movie.worker_id != null) {
            workerID = movie.worker_id;
          }

          if (movie.emergency_worker_id != null) {
            emergencyWorkerID = movie.emergency_worker_id;
          }

          const localMovie = new Movie(
            movie.id,
            movie.name,
            Converter.getIOSDate(movie.date),
            movie.trailer_link,
            movie.poster_link,
            workerID,
            movie.worker_name,
            emergencyWorkerID,
            movie.emergency_worker_name,
            movie.booked_tickets,
            movie.maximal_tickets
          );

          movies.push(localMovie);
        }
        this.setMovies(movies);
      },
      (error) => console.log(error)
    );
  }

  public getMovie(movieID: number) {
    this.fetchMovie(movieID);
    return this._movie;
  }

  private setMovie(movie: Movie) {
    this._movie = movie;
    this.movieChange.next(this._movie);
  }

  private fetchMovie(movieID: number) {
    this.httpService.loggedInV1GETRequest('/cinema/administration/single/' + movieID, 'fetchMovie').subscribe(
      (data: any) => {
        console.log(data);

        const movie = data.movie;

        let workerID = -1;
        let emergencyWorkerID = -1;

        if (movie.worker_id != null) {
          workerID = movie.worker_id;
        }

        if (movie.emergency_worker_id != null) {
          emergencyWorkerID = movie.emergency_worker_id;
        }

        const localMovie = new Movie(
          movie.id,
          movie.name,
          Converter.getIOSDate(movie.date),
          movie.trailer_link,
          movie.poster_link,
          workerID,
          movie.worker_name,
          emergencyWorkerID,
          movie.emergency_worker_name,
          movie.booked_tickets,
          movie.maximal_tickets
        );

        const localBookings = [];

        for (const booking of movie.bookings) {
          localBookings.push(new MovieBookingUser(booking.user_id, booking.firstname, booking.surname, booking.amount));
        }
        localMovie.setBookingsUsers(localBookings);
        this.setMovie(localMovie);
      },
      (error) => console.log(error)
    );
  }

  public bookForUsers(bookings: MovieBookingUser[], movieId: number) {
    const bookingsDTO = [];
    for (const booking of bookings) {
      const bookingDTO = {
        user_id: booking.userID,
        ticket_amount: booking.amount,
      };
      bookingsDTO.push(bookingDTO);
    }
    const dto = {
      bookings: bookingsDTO,
    };
    console.log(dto);
    return this.httpService.loggedInV1POSTRequest('/cinema/administration/movie/' + movieId + '/bookForUsers', dto, 'bookForUser');
  }

  public cancelBookingForUsers(bookings: MovieBookingUser[], movieId: number) {
    const userIdsDTO = [];
    for (const booking of bookings) {
      userIdsDTO.push(booking.userID);
    }
    const dto = {
      user_ids: userIdsDTO,
    };

    return this.httpService.loggedInV1POSTRequest(
      '/cinema/administration/movie/' + movieId + '/cancelBookingForUsers',
      dto,
      'removeBookingForUsers'
    );
  }
}
