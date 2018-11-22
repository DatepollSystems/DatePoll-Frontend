import {Injectable} from '@angular/core';
import {User, UsersService} from '../../users.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  private _movies: Movie[];

  private _selectedMovie: Movie = null;

  constructor(private usersService: UsersService) {
    this._movies = [];

    for (let i = 1; i < 21; i++) {
      const worker = new User(i, '', 'Bob' + i, 'Super' + i, i + 'boy@gmail.com', new Date('2018-12-3'));

      this._movies.push(new Movie(i, 'Toller Film ' + i,
        new Date('2018-12-' + i),
        'https://google.com',
        'http://cdn.collider.com/wp-content/uploads/Inception-movie-poster-3.jpg',
        worker,
        worker,
        i));

      usersService.getUsers().push(worker);
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

  private _worker: User;
  private _emergencyWorker: User;

  private _bookedTickets: number;

  constructor(ID: number, name: string, movieDate: Date, trailerLink: string, imageLink: string, worker: User, emergencyWorker: User,
              bookedTickets: number) {
    this._ID = ID;
    this._name = name;
    this._date = movieDate;
    this._trailerLink = trailerLink;
    this._imageLink = imageLink;
    this._worker = worker;
    this._emergencyWorker = emergencyWorker;
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

  public getWorker(): User {
    return this._worker;
  }

  public getEmergencyWorker(): User {
    return this._emergencyWorker;
  }

  public getBookedTickets(): number {
    return this._bookedTickets;
  }

  public setBookedTickets(bookedTickets: number) {
    this._bookedTickets = bookedTickets;
  }
}
