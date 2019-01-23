import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';

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

  apiUrl = environment.apiUrl;

  constructor(private http: Http) {
    this._movies = [];
    this._notShownMovies = [];

    // let day;
    //
    // for (let i = 1; i < 21; i++) {
    //   // Fixes a iOS bug
    //   if (i < 10) {
    //     day = '0' + i;
    //   } else {
    //     day = i;
    //   }
    //
    //   this._movies.push(new Movie(i, 'Toller Film ' + i,
    //     new Date('2019-01-' + day),
    //     'https://google.com',
    //     'http://cdn.collider.com/wp-content/uploads/Inception-movie-poster-3.jpg',
    //     'Bob' + i,
    //     'Nachname' + i,
    //     i));
    // }
  }

  public getMovies(): Movie[] {
    this.checkAndFetchMovies();
    return this._movies;
  }

  public setMovies(movies: Movie[]) {
    this._movies = movies;
    this.moviesChange.next(this._movies.slice());
  }

  public getNotShownMovies(): Movie[] {
    this.checkAndFetchNotShownMovies();
    return this._notShownMovies;
  }

  public setNotShownMovies(movies: Movie[]) {
    this._notShownMovies = movies;
    this.notShownMoviesChange.next(this._notShownMovies.slice());
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

  private checkAndFetchMovies() {
    if (this._lastFetchedMovies === null) {
      this._lastFetchedMovies = new Date();
      console.log('fetchMovies | Set date: ' + this._lastFetchedMovies.getTime());
    } else {
      const delta = (new Date().getTime() - this._lastFetchedMovies.getTime()) / 1000;
      if (delta > 60) {
        this._movies = [];
        this._lastFetchedMovies = new Date();
        console.log('fetchMovies | Reset date, new date: ' + this._lastFetchedMovies.getTime());
      } else {
        console.log('fetchNotShownMovies | Seconds since last fetch: ' + delta);
      }
    }

    if (this._movies.length === 0) {
      this.fetchMovies().subscribe(
        (fetchedMovies: any[]) => {
          const movies = [];
          for (const movie of fetchedMovies) {
            const date = new Date(movie.date);
            const localMovie = new Movie(movie.id, movie.name, date, movie.trailerLink,
              movie.posterLink, movie.workerName, movie.emergencyWorkerName, movie.bookedTickets);
            movies.push(localMovie);
          }
          this.setMovies(movies);
        },
        (error) => console.log(error)
      );
    }
  }

  private fetchMovies() {
    return this.http.get(this.apiUrl + '/v1/cinema/movie').pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data.movies;
      }
    ));
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
              movie.posterLink, movie.workerName, movie.emergencyWorkerName, movie.bookedTickets);
            movies.push(localMovie);
          }
          this.setNotShownMovies(movies);
        },
        (error) => console.log(error)
      );
    }
  }

  private fetchNotShownMovies() {
    return this.http.get(this.apiUrl + '/v1/cinema/notShownMovies').pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data.movies;
      }
    ));
  }
}

export class Movie {
  private _ID: number;
  private _name: string;
  private _date: Date;
  private _trailerLink: string;
  private _posterLink: string;

  private _workerName: string;
  private _emergencyWorkerName: string;

  private _bookedTickets: number;

  constructor(ID: number, name: string, movieDate: Date, trailerLink: string, posterLink: string, workerName: string,
              emergencyWorkerName: string, bookedTickets: number) {
    this._ID = ID;
    this._name = name;
    this._date = movieDate;
    this._trailerLink = trailerLink;
    this._posterLink = posterLink;
    this._workerName = workerName;
    this._emergencyWorkerName = emergencyWorkerName;
    this._bookedTickets = bookedTickets;
  }

  public getID(): number {
    return this._ID;
  }

  public getName(): string {
    return this._name;
  }

  public setName(name: string) {
    this._name = name;
  }

  public getDate(): Date {
    return this._date;
  }

  public setDate(date: Date) {
    this._date = date;
  }

  public getTrailerlink(): string {
    return this._trailerLink;
  }

  public setTrailerLink(link: string) {
    this._trailerLink = link;
  }

  public getImageLink(): string {
    return this._posterLink;
  }

  public setImageLink(link: string) {
    this._posterLink = link;
  }

  public getWorkerName(): string {
    return this._workerName;
  }

  public getEmergencyWorkerName(): string {
    return this._emergencyWorkerName;
  }

  public getBookedTickets(): number {
    return this._bookedTickets;
  }

  public setBookedTickets(bookedTickets: number) {
    this._bookedTickets = bookedTickets;
  }
}
