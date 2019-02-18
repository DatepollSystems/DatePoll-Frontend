import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';

import {CinemaService} from '../../cinema.service';

import {MovieBookTicketsModalComponent} from './movie-book-tickets-modal/movie-book-tickets-modal.component';
import {Movie} from '../../movie.model';

import {Subscription} from 'rxjs';
import {Response} from '@angular/http';
import {HttpService} from '../../../../services/http.service';
@Component({
  selector: 'app-movie-ticket',
  templateUrl: './movie-ticket.component.html',
  styleUrls: ['./movie-ticket.component.css']
})
export class MovieTicketComponent implements OnInit {

  @Input('movie') movie: Movie;
  moviesSubscription: Subscription;
  soldOut: boolean;

  constructor(private dialog: MatDialog, private cinemaService: CinemaService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.soldOut = this.movie.getBookedTickets() >= 20;

    this.moviesSubscription = this.cinemaService.moviesChange.subscribe((value) => {
      this.movie = this.cinemaService.getMovieByID(value, this.movie.getID());
    });
  }

  bookTickets() {
    this.dialog.open(MovieBookTicketsModalComponent, {
      width: '45vh',
      data: {movie: this.movie},
    });
  }

  cancelTickets() {
    this.httpService.loggedInV1DELETERequest('/cinema/booking/' + this.movie.getID(), 'cancelTickets').subscribe(
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
  }
}
