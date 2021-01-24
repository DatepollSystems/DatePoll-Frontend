import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {AuthService} from '../../auth/auth.service';
import {HttpService} from '../../utils/http.service';
import {SettingsService} from '../../utils/settings.service';
import {Converter} from '../../utils/helper/Converter';

import {Movie, WeatherForecast} from './models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class CinemaUserService {
  private _notShownMovies: Movie[] = null;
  public notShownMoviesChange: Subject<Movie[]> = new Subject<Movie[]>();

  private city_id = '';
  private openWeatherMapCinemaCityIdSubscription: Subscription;
  private openweahtermap_api_key = '';
  private openWeatherMapKeySubscription: Subscription;
  public fetchedWeatherForecast = false;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.openweahtermap_api_key = this.settingsService.getOpenWeatherMapKey();
    this.openWeatherMapKeySubscription = this.settingsService.openWeatherMapKeyChange.subscribe((value) => {
      this.openweahtermap_api_key = value;
    });

    this.city_id = this.settingsService.getOpenWeatherMapCinemaCityId();
    this.openWeatherMapCinemaCityIdSubscription = this.settingsService.openWeatherMapCinemaCityIdChange.subscribe((value) => {
      this.city_id = value;
    });
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

          if (movie.worker_id != null) {
            workerID = movie.worker_id;
          }

          if (movie.emergency_worker_id != null) {
            emergencyWorkerID = movie.emergency_worker_id;
          }

          const localMovie = new Movie(
            movie.id,
            movie.name,
            Converter.getIOSDate(movie.date),
            movie.trailer_link,
            movie.poster_link,
            workerID,
            movie.worker_name,
            emergencyWorkerID,
            movie.emergency_worker_name,
            movie.booked_tickets,
            movie.maximal_tickets
          );
          localMovie.bookedTicketsForYourself = movie.booked_tickets_for_yourself;
          movies.push(localMovie);
        }
        this.setNotShownMovies(movies);
      },
      (error) => console.log(error)
    );
  }

  public fetchWeatherForecastForNotShownMovies() {
    this.http
      .get(
        'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=de&id=' + this.city_id + '&APPID=' + this.openweahtermap_api_key
      )
      .subscribe(
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
                const temperature = tempObject.main.temp;
                const weather = tempObject.weather[0].description;
                const cloudy = tempObject.clouds.all;
                const windSpeed = tempObject.wind.speed;
                const windDirection = tempObject.wind.deg;

                const weatherForecast = new WeatherForecast(temperature, weather, cloudy, windSpeed, windDirection, date);

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
