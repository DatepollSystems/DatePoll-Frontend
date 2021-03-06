import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {Movie} from '../../../models/movie.model';
import {CinemaUserService} from '../../../cinema-user.service';

@Component({
  selector: 'app-movie-weatherforecast-modal',
  templateUrl: './movie-weatherforecast-modal.component.html',
  styleUrls: ['./movie-weatherforecast-modal.component.css'],
})
export class MovieWeatherforecastModalComponent {
  movie: Movie;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MovieWeatherforecastModalComponent>,
    public cinemaService: CinemaUserService
  ) {
    this.movie = data.movie;

    if (!cinemaService.fetchedWeatherForecast) {
      cinemaService.fetchWeatherForecastForNotShownMovies();
    }
  }
}
