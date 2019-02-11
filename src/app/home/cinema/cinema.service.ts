import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../http.service';
import {Movie} from './movie';
import {Year} from './year';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  private _lastFetchedMovies: Date = null;
  private _movies: Movie[];
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _lastFetchedNotShownMovies: Date = null;
  private _notShownMovies: Movie[];
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _lastFetchedYears: Date = null;
  private _years: Year[];
  public yearsChange: Subject<Year[]> = new Subject<Year[]>();

  constructor(private authService: AuthService, private httpService: HttpService) {
    this._movies = [];
    this._notShownMovies = [];
    this._years = [];
  }

  public addMovie(movie: any) {
    return this.httpService.loggedInV1POSTRequest('/cinema/movie', movie, 'addMovie');
  }

  public updateMovie(movieID: number, movie: any) {
    return this.httpService.loggedInV1PUTRequest('/cinema/movie/' + movieID, movie, 'updateMovie');
  }

  public deleteMovie(movieID: number) {
    return this.httpService.loggedInV1DELETERequest('/cinema/movie/' + movieID, 'deleteMovie');
  }

  public getMovies(): Movie[] {
    this.checkAndFetchMovies();
    return this._movies.slice();
  }

  public setMovies(movies: Movie[]) {
    this._movies = movies;
    this.moviesChange.next(this._movies.slice());
  }

  public getMovieByID(id: number) {
    let movie;
    for (let i = 0; i < this._movies.length; i++) {
      if (this._movies[i].getID() === id) {
        movie = this._movies[i];
      }
    }

    return movie;
  }

  public checkAndFetchMovies(force: boolean = false) {
    let fetchMovies = false;

    if (this._lastFetchedMovies === null) {
      fetchMovies = true;
      this._lastFetchedMovies = new Date();
      console.log('fetchMovies | Set date: ' + this._lastFetchedMovies.getTime());
    } else {
      const delta = (new Date().getTime() - this._lastFetchedMovies.getTime()) / 1000;
      if (delta > 60) {
        fetchMovies = true;
        this._lastFetchedMovies = new Date();
        console.log('fetchMovies | Reset date, new date: ' + this._lastFetchedMovies.getTime());
      } else {
        console.log('fetchMovies | Seconds since last fetch: ' + delta);
      }
    }

    if (fetchMovies || force) {
      this.httpService.loggedInV1GETRequest('/cinema/movie', 'fetchMovies').subscribe(
        (data: any) => {
          const fetchedMovies = data.movies;

          const movies = [];
          for (const movie of fetchedMovies) {
            const date = new Date(movie.date);
            const localMovie = new Movie(movie.id, movie.name, date, movie.trailerLink,
              movie.posterLink, movie.workerName, movie.emergencyWorkerName, movie.bookedTickets, movie.movie_year_id);
            movies.push(localMovie);
          }
          this.setMovies(movies);
        },
        (error) => console.log(error)
      );
    }
  }


  public getNotShownMovies(): Movie[] {
    this.checkAndFetchNotShownMovies();
    return this._notShownMovies;
  }

  public setNotShownMovies(movies: Movie[]) {
    this._notShownMovies = movies;
    this.notShownMoviesChange.next(this._notShownMovies.slice());
  }

  private checkAndFetchNotShownMovies() {
    if (this._lastFetchedNotShownMovies === null) {
      this._lastFetchedNotShownMovies = new Date();
      console.log('fetchNotShownMovies | Set date: ' + this._lastFetchedNotShownMovies.getTime());
    } else {
      const delta = (new Date().getTime() - this._lastFetchedNotShownMovies.getTime()) / 1000;
      if (delta > 60) {
        this._notShownMovies = [];
        this._lastFetchedNotShownMovies = new Date();
        console.log('fetchNotShownMovies | Reset date, new date: ' + this._lastFetchedNotShownMovies.getTime());
      } else {
        console.log('fetchNotShownMovies | Seconds since last fetch: ' + delta);
      }
    }

    if (this._notShownMovies.length === 0) {
      this.httpService.loggedInV1GETRequest('/cinema/notShownMovies', 'fetchNotShownMovies').subscribe(
        (data: any) => {
          const fetchedMovies = data.movies;

          const movies = [];
          for (const movie of fetchedMovies) {
            const date = new Date(movie.date);
            const localMovie = new Movie(movie.id, movie.name, date, movie.trailerLink,
              movie.posterLink, movie.workerName, movie.emergencyWorkerName, movie.bookedTickets, movie.movie_year_id);
            movies.push(localMovie);
          }
          this.setNotShownMovies(movies);
        },
        (error) => console.log(error)
      );
    }
  }


  public addYear(year: any) {
    return this.httpService.loggedInV1POSTRequest('/cinema/year', year, 'addYear');
  }

  public getYears(): Year[] {
    this.checkAndFetchYears();
    return this._years.slice();
  }

  public setYears(years: Year[]) {
    this._years = years;
    this.yearsChange.next(this._years.slice());
  }

  public checkAndFetchYears(force: boolean = false) {
    let fetchYears = false;

    if (this._lastFetchedYears === null) {
      fetchYears = true;
      this._lastFetchedYears = new Date();
      console.log('fetchYears | Set date: ' + this._lastFetchedYears.getTime());
    } else {
      const delta = (new Date().getTime() - this._lastFetchedYears.getTime()) / 1000;
      if (delta > 60) {
        fetchYears = true;
        this._lastFetchedYears = new Date();
        console.log('fetchYears | Reset date, new date: ' + this._lastFetchedYears.getTime());
      } else {
        console.log('fetchYears | Seconds since last fetch: ' + delta);
      }
    }

    if (fetchYears || force) {
      this.httpService.loggedInV1GETRequest('/cinema/year', 'fetchYears').subscribe(
        (data: any) => {
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
  }
}
