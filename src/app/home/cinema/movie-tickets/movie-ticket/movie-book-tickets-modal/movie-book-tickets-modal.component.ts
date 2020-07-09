import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {HttpService} from '../../../../../utils/http.service';
import {MyUserService} from '../../../../my-user.service';
import {CinemaService} from '../../../cinema.service';

import {Movie} from '../../../models/movie.model';

@Component({
  selector: 'app-movie-book-tickets-modal',
  templateUrl: './movie-book-tickets-modal.component.html',
  styleUrls: ['./movie-book-tickets-modal.component.css']
})
export class MovieBookTicketsModalComponent {
  movie: Movie;
  freeTickets: number;

  ticketsToBook: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MovieBookTicketsModalComponent>,
    private httpService: HttpService,
    private myUserService: MyUserService,
    private cinemaService: CinemaService
  ) {
    this.movie = data.movie;

    this.freeTickets = 20 - this.movie.bookedTickets;
  }

  bookTickets() {
    if (this.ticketsToBook < 1) {
      return;
    }

    const bookingObject = {
      movie_id: this.movie.id,
      ticket_amount: this.ticketsToBook
    };

    this.httpService.loggedInV1POSTRequest('/cinema/booking', bookingObject, 'bookTickets').subscribe(
      (data: any) => {
        console.log(data);
        this.movie.bookedTickets += this.ticketsToBook;
        this.movie.bookedTicketsForYourself += this.ticketsToBook;
        if (this.movie.bookedTickets === 20 || this.movie.bookedTickets === 0) {
          this.cinemaService.fetchNotShownMovies();
        }
      },
      error => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
    this.dialogRef.close();
  }
}
