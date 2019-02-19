import {Component, Inject} from '@angular/core';
import {Response} from '@angular/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {HttpService} from '../../../../../services/http.service';
import {MyUserService} from '../../../../my-user.service';
import {CinemaService} from '../../../cinema.service';

import {Movie} from '../../../movie.model';

@Component({
  selector: 'app-movie-book-tickets-modal',
  templateUrl: './movie-book-tickets-modal.component.html',
  styleUrls: ['./movie-book-tickets-modal.component.css']
})
export class MovieBookTicketsModalComponent {

  movie: Movie;
  freeTickets: number;

  ticketsToBook: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<MovieBookTicketsModalComponent>,
              private httpService: HttpService,
              private myUserService: MyUserService,
              private cinemaService: CinemaService) {
    this.movie = data.movie;

    this.freeTickets = 20 - this.movie.getBookedTickets();
  }

  bookTickets() {
    const bookingObject = {
      'movie_id': this.movie.getID(),
      'ticketAmount': this.ticketsToBook
    };

    this.httpService.loggedInV1POSTRequest('/cinema/booking', bookingObject, 'bookTickets').subscribe(
      (reponse: Response) => {
        const data = reponse.json();
        console.log(data);
        this.cinemaService.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
    this.dialogRef.close();
  }
}
