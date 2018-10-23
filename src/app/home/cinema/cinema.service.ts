import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  constructor() { }
}

export class Movie {
  private _ID: number;
  _name: string;
  _date: string;
  _trailerLink: string;

  _worker: string;
  _emergencyWorker: string;

  constructor(ID: number, name: string, date: string, trailerLink: string, worker: string, emergencyWorker: string) {
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

  getWorker(): string {
    return this._worker;
  }
}
