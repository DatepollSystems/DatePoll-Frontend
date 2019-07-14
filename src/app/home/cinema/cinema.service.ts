import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../services/http.service';
import {Movie, MovieBookingUser, WeatherForecast} from './models/movie.model';
import {Year} from './models/year.model';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();
  public yearsChange: Subject<Year[]> = new Subject<Year[]>();
  private city_id = environment.cinema_weatherforecast_openweathermap_city_id;
  private openweahtermap_api_key = environment.cinema_weatherforecast_openweathermap_api_key;
  private _movies: Movie[];
  private _notShownMovies: Movie[] = null;
  private _years: Year[];

  constructor(private authService: AuthService, private httpService: HttpService, private http: HttpClient) {
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

        this.http.get('https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=de&id=' + this.city_id + '&APPID='
          + this.openweahtermap_api_key).subscribe(
          (response: any) => {
            console.log(response);

            for (const tempObject of response.list) {
              const date = new Date(tempObject.dt_txt);

              for (const movie of this._notShownMovies) {
                const maxDate = new Date(movie.date.toDateString());
                maxDate.setDate(maxDate.getDate() + 1);
                maxDate.setHours(0);

                const minDate = new Date(movie.date.toDateString());
                minDate.setHours(18);

                if (minDate.getTime() <= date.getTime() && maxDate.getTime() >= date.getTime()) {
                  // console.log(movie.name + ': Date - ' + date + ' | MinDate - ' + minDate.getTime() + ' | MaxDate - '
                  // + maxDate.getTime() + ' | Date: ' + date.getTime());

                  const temperature = tempObject.main.temp;
                  const weather = tempObject.weather[0].description;
                  const cloudy = tempObject.clouds.all;
                  const windSpeed = tempObject.wind.speed;
                  const windDirection = tempObject.wind.deg;

                  const weatherForecast = new WeatherForecast(temperature, weather, cloudy, windSpeed, windDirection, 0, date);

                  const weatherForecasts = movie.getWeatherForecasts();
                  weatherForecasts.push(weatherForecast);
                  movie.setWeatherforecasts(weatherForecasts);
                }
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
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
    return this.httpService.loggedInV1POSTRequest('/cinema/worker/' + movieID, {}, 'applyForWorker');
  }

  public signOutForWorker(movieID: number) {
    return this.httpService.loggedInV1DELETERequest('/cinema/worker/' + movieID, 'signOutForWorker');
  }

  public applyForEmergencyWorker(movieID: number) {
    return this.httpService.loggedInV1POSTRequest('/cinema/emergencyWorker/' + movieID, {}, 'applyForEmergencyWorker');
  }

  public signOutForEmergencyWorker(movieID: number) {
    return this.httpService.loggedInV1DELETERequest('/cinema/emergencyWorker/' + movieID, 'signOutForEmergencyWorker');
  }
}
