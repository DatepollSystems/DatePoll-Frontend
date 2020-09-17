import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NotificationsService, NotificationType} from 'angular2-notifications';
import {CinemaService} from '../../cinema.service';

@Component({
  selector: 'app-movie-delete-modal',
  templateUrl: './movie-delete-modal.component.html',
  styleUrls: ['./movie-delete-modal.component.css'],
})
export class MovieDeleteModalComponent {
  @ViewChild('successfullyDeletedMovie', {static: true}) successfullyDeletedMovie: TemplateRef<any>;
  movieID: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<MovieDeleteModalComponent>,
    private notificationsService: NotificationsService,
    private cinemaService: CinemaService
  ) {
    this.movieID = data.movieID;
  }

  yes() {
    this.cinemaService.deleteMovie(this.movieID).subscribe(
      (response: any) => {
        console.log(response);
        this.cinemaService.fetchMovies();
        this.notificationsService.html(this.successfullyDeletedMovie, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
