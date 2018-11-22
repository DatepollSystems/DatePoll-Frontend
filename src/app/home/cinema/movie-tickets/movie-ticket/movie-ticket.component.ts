import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MovieBookTicketsModalComponent} from './movie-book-tickets-modal/movie-book-tickets-modal.component';
import {Movie} from '../../cinema.service';

@Component({
  selector: 'app-movie-ticket',
  templateUrl: './movie-ticket.component.html',
  styleUrls: ['./movie-ticket.component.css']
})
export class MovieTicketComponent implements OnInit{

  @Input('movie') movie: Movie;
  soldOut: boolean;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.movie.getBookedTickets() >= 20) {
      this.soldOut = true;
    } else {
      this.soldOut = false;
    }
  }

  bookTickets() {
    this.dialog.open(MovieBookTicketsModalComponent, {
      width: '45vh',
      data: {movie: this.movie},
    });
  }
}
