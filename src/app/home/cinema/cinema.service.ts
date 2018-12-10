import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  private _movies: Movie[];

  private _selectedMovie: Movie = null;

  constructor() {
    this._movies = [];

    let day;

    for (let i = 1; i < 21; i++) {
      // Fixes a iOS bug
      if (i < 10) {
        day = '0' + i;
      } else {
        day = i;
      }

      this._movies.push(new Movie(i, 'Toller Film ' + i,
        new Date('2019-01-' + day),
        'https://google.com',
        'http://cdn.collider.com/wp-content/uploads/Inception-movie-poster-3.jpg',
        'Bob' + i,
        'Nachname' + i,
        i));
    }
  }

  public getMovies(): Movie[] {
    return this._movies.slice();
  }

  public setMovies(movies: Movie[]) {
    this._movies = movies;
  }

  public getNotShownMovies(): Movie[] {
    const returnMovies = [];

    for (let i = 0; i < this._movies.length; i++) {
      if (new Date().getTime() < this._movies[i].getDate().getTime()) {
        returnMovies.push(this._movies[i]);
      }
    }

    return returnMovies;
  }

  public setSelectedMovie(movie: Movie) {
    this._selectedMovie = movie;
  }

  public getSelectedMovie(): Movie {
    return this._selectedMovie;
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
}

export class Movie {
  private _ID: number;
  private _name: string;
  private _date: Date;
  private _trailerLink: string;
  private _imageLink: string;

  private _workerName: string;
  private _emergencyWorkerName: string;

  private _bookedTickets: number;

  constructor(ID: number, name: string, movieDate: Date, trailerLink: string, imageLink: string, workerName: string,
              emergencyWorkerName: string, bookedTickets: number) {
    this._ID = ID;
    this._name = name;
    this._date = movieDate;
    this._trailerLink = trailerLink;
    this._imageLink = imageLink;
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

  public getBeautifullDate(): string {
    const day = this._date.getDate();
    const monthIndex = this._date.getMonth();
    const year = this._date.getFullYear();

    return day + '/' + (monthIndex + 1) + '/' + year;
  }

  public getTrailerlink(): string {
    return this._trailerLink;
  }

  public setTrailerLink(link: string) {
    this._trailerLink = link;
  }

  public getImageLink(): string {
    return this._imageLink;
  }

  public setImageLink(link: string) {
    this._imageLink = link;
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
