import { Injectable } from '@angular/core';
import {User, UsersService} from '../../users.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  private _movies: Movie[];

  constructor(private usersService: UsersService) {
    this._movies = [];

    for (let i = 1; i < 10; i++) {
      const worker = new User(i, '', 'Bob' + i, 'Super' + i, i + 'boy@gmail.com', '2018-12-3');

      this._movies.push(new Movie(i, 'Toller Film ' + i, '2018-12-' + i, 'https://google.com' + i, worker, worker));

      usersService.getUsers().push(worker);
    }
  }

  getMovies() {
    return this._movies;
  }
}

export class Movie {
  private _ID: number;
  _name: string;
  _date: string;
  _trailerLink: string;

  _worker: User;
  _emergencyWorker: User;

  constructor(ID: number, name: string, date: string, trailerLink: string, worker: User, emergencyWorker: User) {
    this._ID = ID;
    this._name = name;
    this._date = date;
    this._trailerLink = trailerLink;
    this._worker = worker;
    this._emergencyWorker = emergencyWorker;
  }

  getName(): string {
    return this._name;
  }

  getDate(): string {
    return this._date;
  }

  getTrailerlink(): string {
    return this._trailerLink;
  }

  getWorker(): User {
    return this._worker;
  }

  getEmergencyWorker(): User {
    return this._emergencyWorker;
  }
}
