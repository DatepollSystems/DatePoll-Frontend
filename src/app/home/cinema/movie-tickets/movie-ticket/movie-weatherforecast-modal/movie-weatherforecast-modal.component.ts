import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Movie} from '../../../models/movie.model';

@Component({
  selector: 'app-movie-weatherforecast-modal',
  templateUrl: './movie-weatherforecast-modal.component.html',
  styleUrls: ['./movie-weatherforecast-modal.component.css']
})
export class MovieWeatherforecastModalComponent {

  private movie: Movie;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<MovieWeatherforecastModalComponent>) {
    this.movie = data.movie;
  }
}
