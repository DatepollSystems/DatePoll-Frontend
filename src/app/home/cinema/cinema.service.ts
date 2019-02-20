import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../services/http.service';

import {Movie} from './movie.model';
import {Year} from './year.model';
import {Response} from '@angular/http';
import {HomepageService} from '../start/homepage.service';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  private _movies: Movie[];
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _notShownMovies: Movie[];
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _years: Year[];
  public yearsChange: Subject<Year[]> = new Subject<Year[]>();

  constructor(private authService: AuthService, private httpService: HttpService, private homePageService: HomepageService) {
    this._movies = [];
    this._notShownMovies = [];
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

  public getMovieByID(movies: Movie[], id: number) {
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].getID() === id) {
        return movies[i];
      }
    }

    return null;
  }

  public fetchMovies() {
    this.httpService.loggedInV1GETRequest('/cinema/administration/movie', 'fetchMovies').subscribe(
      (data: any) => {
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
          movies.push(localMovie);
        }
        this.setMovies(movies);
      },
      (error) => console.log(error)
    );
  }


  public getNotShownMovies(): Movie[] {
    this.fetchNotShownMovies();
    return this._notShownMovies;
  }

  public setNotShownMovies(movies: Movie[]) {
    this._notShownMovies = movies;
    this.notShownMoviesChange.next(this._notShownMovies.slice());
  }

  public fetchNotShownMovies() {
    this.httpService.loggedInV1GETRequest('/cinema/notShownMovies', 'fetchNotShownMovies').subscribe(
      (data: any) => {
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
          localMovie.setBookedTicketsForYourself(movie.bookedTicketsForYourself);
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
      (response: Response) => {
        const data = response.json();
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
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.fetchNotShownMovies();
      }
    );
  }

  public applyForEmergencyWorker(movieID: number) {
    this.httpService.loggedInV1POSTRequest('/cinema/emergencyWorker/' + movieID, {}, 'applyForEmergencyWorker').subscribe(
      (response: Response) => {
        const data = response.json();
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
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.fetchNotShownMovies();
      }
    );
  }
}
