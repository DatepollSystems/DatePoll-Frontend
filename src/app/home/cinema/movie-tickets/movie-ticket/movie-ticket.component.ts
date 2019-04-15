import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';

import {Subscription} from 'rxjs';

import {HttpService} from '../../../../services/http.service';
import {MyUserService} from '../../../my-user.service';
import {CinemaService} from '../../cinema.service';

import {MovieBookTicketsModalComponent} from './movie-book-tickets-modal/movie-book-tickets-modal.component';
import {Movie} from '../../movie.model';

@Component({
  selector: 'app-movie-ticket',
  templateUrl: './movie-ticket.component.html',
  styleUrls: ['./movie-ticket.component.css']
})
export class MovieTicketComponent implements OnInit {
  @Input()
  movie: Movie;

  moviesSubscription: Subscription;
  soldOut: boolean;

  myUserService: MyUserService;

  constructor(private dialog: MatDialog,
              private cinemaService: CinemaService,
              myUserService: MyUserService,
              private httpService: HttpService) {
    this.myUserService = myUserService;
  }

  ngOnInit(): void {
    this.soldOut = this.movie.bookedTickets >= 20;

    this.moviesSubscription = this.cinemaService.moviesChange.subscribe((value) => {
      this.movie = this.cinemaService.getMovieByID(value, this.movie.id);
    });
  }

  bookTickets() {
    this.dialog.open(MovieBookTicketsModalComponent, {
      width: '60vh',
      data: {movie: this.movie},
    });
  }

  cancelTickets() {
    this.httpService.loggedInV1DELETERequest('/cinema/booking/' + this.movie.id, 'cancelTickets').subscribe(
      (data: any) => {
        console.log(data);
        this.cinemaService.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  applyForWorker() {
    this.cinemaService.applyForWorker(this.movie.id);
  }

  signOutForWorker() {
    this.cinemaService.signOutForWorker(this.movie.id);
  }

  applyForEmergencyWorker() {
    this.cinemaService.applyForEmergencyWorker(this.movie.id);
  }

  signOutForEmergencyWorker() {
    this.cinemaService.signOutForEmergencyWorker(this.movie.id);
  }
}
