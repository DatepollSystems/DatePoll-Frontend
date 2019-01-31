import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {environment} from '../../../environments/environment';

import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Movie} from './movie';
import {Year} from './year';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  apiUrl = environment.apiUrl;

  private _lastFetchedMovies: Date = null;
  private _movies: Movie[];
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _lastFetchedNotShownMovies: Date = null;
  private _notShownMovies: Movie[];
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _lastFetchedYears: Date = null;
  private _years: Year[];
  public yearsChange: Subject<Year[]> = new Subject<Year[]>();

  constructor(private http: Http, private authService: AuthService) {
    this._movies = [];
    this._notShownMovies = [];
    this._years = [];
  }

  public addMovie(movie: any) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = this.authService.getToken('addMovie');

    return this.http.post(this.apiUrl + '/v1/cinema/movie?token=' + token, movie, {headers: headers});
  }

  public updateMovie(movieID: number, movie: any) {
    const token = this.authService.getToken('updateMovie');
    const headers = new Headers({'Content-Type': 'application/json'});

    return this.http.put(this.apiUrl + '/v1/cinema/movie/' + movieID + '?token=' + token, movie, {headers: headers});
  }

  public deleteMovie(movieID: number) {
    const token = this.authService.getToken('deleteMovie');
    return this.http.delete(this.apiUrl + '/v1/cinema/movie/' + movieID + '?token=' + token);
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
      this.fetchMovies().subscribe(
        (fetchedMovies: any[]) => {
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

  private fetchMovies() {
    const token = this.authService.getToken('fetchMovies');

    return this.http.get(this.apiUrl + '/v1/cinema/movie?token=' + token).pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data.movies;
      }
    ));
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
      this.fetchNotShownMovies().subscribe(
        (fetchedMovies: any[]) => {
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

  private fetchNotShownMovies() {
    const token = this.authService.getToken('fetchNotShownMovies');

    return this.http.get(this.apiUrl + '/v1/cinema/notShownMovies?token=' + token).pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data.movies;
      }
    ));
  }


  public addYear(year: any) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = this.authService.getToken('addYear');

    return this.http.post(this.apiUrl + '/v1/cinema/year?token=' + token, year, {headers: headers});
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
      this.fetchYears().subscribe(
        (fetchedYears: any[]) => {
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

  private fetchYears() {
    const token = this.authService.getToken('fetchYears');

    return this.http.get(this.apiUrl + '/v1/cinema/year?token=' + token).pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data.years;
      }
    ));
  }
}
