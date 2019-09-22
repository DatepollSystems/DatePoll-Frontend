import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../services/http.service';
import {SettingsService} from '../../services/settings.service';
import {Movie, MovieBookingUser, WeatherForecast} from './models/movie.model';
import {Year} from './models/year.model';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  private _movies: Movie[] = [];
  public moviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _notShownMovies: Movie[] = null;
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private _years: Year[] = [];
  public yearsChange: Subject<Year[]> = new Subject<Year[]>();

  private _movie: Movie;
  public movieChange: Subject<Movie> = new Subject<Movie>();

  private city_id = '';
  private openWeatherMapCinemaCityIdSubscription: Subscription;
  private openweahtermap_api_key = '';
  private openWeatherMapKeySubscription: Subscription;
  public fetchedWeatherForecast = false;

  constructor(private authService: AuthService,
              private httpService: HttpService,
              private http: HttpClient,
              private settingsService: SettingsService) {

    this.openweahtermap_api_key = this.settingsService.getOpenWeatherMapKey();
    this.openWeatherMapKeySubscription = this.settingsService.openWeatherMapKeyChange.subscribe((value) => {
      this.openweahtermap_api_key = value;
    });

    this.city_id = this.settingsService.getOpenWeatherMapCinemaCityId();
    this.openWeatherMapCinemaCityIdSubscription = this.settingsService.openWeatherMapCinemaCityIdChange.subscribe((value) => {
      this.city_id = value;
    });
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

          movies.push(localMovie);
        }
        this.setMovies(movies);
      },
      (error) => console.log(error)
    );
  }


  public getMovie(movieID: number) {
    this.fetchMovie(movieID);
    return this._movie;
  }

  private setMovie(movie: Movie) {
    this._movie = movie;
    this.movieChange.next(this._movie);
  }

  private fetchMovie(movieID: number) {
    this.httpService.loggedInV1GETRequest('/cinema/administration/movie/' + movieID, 'fetchMovie').subscribe(
      (data: any) => {
        console.log(data);

        const movie = data.movie;

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

        for (const booking of movie.bookings) {
          localBookings.push(new MovieBookingUser(booking.user_id, booking.firstname, booking.surname, booking.amount));
        }
        localMovie.setBookingsUsers(localBookings);
        this.setMovie(localMovie);
      },
      (error) => console.log(error)
    );
  }

  public bookForUsers(bookings: MovieBookingUser[], movieId: number) {
    const bookingsDTO = [];
    for (const booking of bookings) {
      const bookingDTO = {
        'user_id': booking.userID,
        'amount': booking.amount
      };
      bookingsDTO.push(bookingDTO);
    }
    const dto = {
      'bookings': bookingsDTO
    };
    console.log(dto);
    return this.httpService.loggedInV1POSTRequest('/cinema/administration/movie/' + movieId + '/bookForUsers', dto,
      'bookForUser');
  }

  public cancelBookingForUsers(bookings: MovieBookingUser[], movieId: number) {
    const userIdsDTO = [];
    for (const booking of bookings) {
      userIdsDTO.push(booking.userID);
    }
    const dto = {
      'user_ids': userIdsDTO
    };

    return this.httpService.loggedInV1POSTRequest('/cinema/administration/movie/' + movieId + '/cancelBookingForUsers', dto,
      'removeBookingForUsers');
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
      },
      (error) => console.log(error)
    );
  }

  public fetchWeatherForecastForNotShownMovies() {
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

        this.fetchedWeatherForecast = true;
      },
      (error) => {
        console.log(error);
      }
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
