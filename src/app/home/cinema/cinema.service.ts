import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../services/http.service';
import {HomepageService} from '../start/homepage.service';
import {Movie, MovieBookingUser} from './models/movie.model';
import {Year} from './models/year.model';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();
  public yearsChange: Subject<Year[]> = new Subject<Year[]>();
  private _movies: Movie[];
  private _notShownMovies: Movie[] = null;
  private _years: Year[];

  constructor(private authService: AuthService, private httpService: HttpService, private homePageService: HomepageService) {
    this._movies = [];
    this._years = [];
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

  public getMovies(): Movie[] {
    this.fetchMovies();
    return this._movies.slice();
  }

  public setMovies(movies: Movie[]) {
    this._movies = movies;
    this.moviesChange.next(this._movies.slice());
  }

  public fetchMovies() {
    this.httpService.loggedInV1GETRequest('/cinema/administration/movie', 'fetchMovies').subscribe(
      (data: any) => {
        console.log(data);

        const fetchedMovies = data.movies;

        const movies = [];
        for (const movie of fetchedMovies) {
          let workerID = -1;
          let emergencyWorkerID = -1;

          if (movie.workerID != null) {
            workerID = movie.workerID;
          }

          if (movie.emergencyWorkerID != null) {
            emergencyWorkerID = movie.emergencyWorkerID;
          }

          const date = new Date(movie.date);
          const localMovie = new Movie(movie.id, movie.name, date, movie.trailerLink, movie.posterLink, workerID, movie.workerName,
            emergencyWorkerID, movie.emergencyWorkerName, movie.bookedTickets, movie.movie_year_id);

          const localBookings = [];
          const bookings = movie.bookings;
          for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];
            const localMovieBookingUser = new MovieBookingUser(booking.firstname, booking.surname, booking.amount);
            localBookings.push(localMovieBookingUser);
          }
          localMovie.setBookingsUsers(localBookings);
          movies.push(localMovie);
        }
        this.setMovies(movies);
      },
      (error) => console.log(error)
    );
  }


  public getNotShownMovies(): Movie[] {
    this.fetchNotShownMovies();
    if (this._notShownMovies == null) {
      return null;
    }
    return this._notShownMovies.slice();
  }

  public setNotShownMovies(movies: Movie[]) {
    this._notShownMovies = movies;
    this.notShownMoviesChange.next(this._notShownMovies.slice());
  }

  public fetchNotShownMovies() {
    this.httpService.loggedInV1GETRequest('/cinema/notShownMovies', 'fetchNotShownMovies').subscribe(
      (data: any) => {
        console.log(data);

        const fetchedMovies = data.movies;

        const movies = [];
        for (const movie of fetchedMovies) {
          let workerID = -1;
          let emergencyWorkerID = -1;

          if (movie.workerID != null) {
            workerID = movie.workerID;
          }

          if (movie.emergencyWorkerID != null) {
            emergencyWorkerID = movie.emergencyWorkerID;
          }

          const date = new Date(movie.date);
          const localMovie = new Movie(movie.id, movie.name, date, movie.trailerLink, movie.posterLink, workerID, movie.workerName,
            emergencyWorkerID, movie.emergencyWorkerName, movie.bookedTickets, movie.movie_year_id);
          localMovie.bookedTicketsForYourself = movie.bookedTicketsForYourself;
          movies.push(localMovie);
        }
        this.setNotShownMovies(movies);
      },
      (error) => console.log(error)
    );
  }


  public addYear(year: any) {
    return this.httpService.loggedInV1POSTRequest('/cinema/administration/year', year, 'addYear');
  }

  public getYears(): Year[] {
    this.fetchYears();
    return this._years.slice();
  }

  public setYears(years: Year[]) {
    this._years = years;
    this.yearsChange.next(this._years.slice());
  }

  public fetchYears() {
    this.httpService.loggedInV1GETRequest('/cinema/administration/year', 'fetchYears').subscribe(
      (data: any) => {
        console.log(data);

        const fetchedYears = data.years;

        const years = [];
        for (const year of fetchedYears) {
          const localYear = new Year(year.id, year.year);
          years.push(localYear);
        }
        this.setYears(years);
      },
      (error) => console.log(error)
    );
  }


  public applyForWorker(movieID: number) {
    this.httpService.loggedInV1POSTRequest('/cinema/worker/' + movieID, {}, 'applyForWorker').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      },
      (error) => {
        console.log(error);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      }
    );
  }

  public signOutForWorker(movieID: number) {
    this.httpService.loggedInV1DELETERequest('/cinema/worker/' + movieID, 'signOutForWorker').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      },
      (error) => {
        console.log(error);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      }
    );
  }

  public applyForEmergencyWorker(movieID: number) {
    this.httpService.loggedInV1POSTRequest('/cinema/emergencyWorker/' + movieID, {}, 'applyForEmergencyWorker').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      },
      (error) => {
        console.log(error);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      }
    );
  }

  public signOutForEmergencyWorker(movieID: number) {
    this.httpService.loggedInV1DELETERequest('/cinema/emergencyWorker/' + movieID, 'signOutForEmergencyWorker').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      },
      (error) => {
        console.log(error);
        this.fetchNotShownMovies();
        this.homePageService.fetchData();
      }
    );
  }
}
