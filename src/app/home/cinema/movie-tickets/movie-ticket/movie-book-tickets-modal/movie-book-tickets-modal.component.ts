import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Movie} from '../../../cinema.service';

@Component({
  selector: 'app-movie-book-tickets-modal',
  templateUrl: './movie-book-tickets-modal.component.html',
  styleUrls: ['./movie-book-tickets-modal.component.css']
})
export class MovieBookTicketsModalComponent {

  private movie: Movie;
  private freeTickets: number;

  private ticketsToBook: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.movie = data.movie;

    this.freeTickets = 20 - this.movie.getBookedTickets();
  }

  bookTickets() {

  }

}
