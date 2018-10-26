import {Injectable} from '@angular/core';
import {User, UsersService} from '../../users.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  private _movies: Movie[];

  constructor(private usersService: UsersService) {
    this._movies = [];

    for (let i = 1; i < 19; i++) {
      const worker = new User(i, '', 'Bob' + i, 'Super' + i, i + 'boy@gmail.com', new Date('2018-12-3'));

      this._movies.push(new Movie(i, 'Toller Film ' + i,
        new Date('2018-12-' + i),
        'https://google.com',
        'http://cdn.collider.com/wp-content/uploads/Inception-movie-poster-3.jpg',
        worker,
        worker, i));

      usersService.getUsers().push(worker);
    }
  }

  public getMovies(): Movie[] {
    return this._movies;
  }

  public getNotShownMovies(): Movie[] {
    const returnMovies = [];

    for(let i = 0; i < this._movies.length; i++) {
      if (new Date().getTime() < this._movies[i].getDate().getTime()) {
        returnMovies.push(this._movies[i]);
      }
    }

    return returnMovies;
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

  constructor(ID: number, name: string, date: Date, trailerLink: string, imageLink: string, worker: User, emergencyWorker: User, bookedTickets: number) {
    this._ID = ID;
    this._name = name;
    this._date = date;
    this._trailerLink = trailerLink;
    this._imageLink = imageLink;
    this._worker = worker;
    this._emergencyWorker = emergencyWorker;
    this._bookedTickets = bookedTickets;
  }

  public getName(): string {
    return this._name;
  }

  public getDate(): Date {
    return this._date;
  }

  public getTrailerlink(): string {
    return this._trailerLink;
  }

  public getImageLink(): string {
    return this._imageLink;
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
}
