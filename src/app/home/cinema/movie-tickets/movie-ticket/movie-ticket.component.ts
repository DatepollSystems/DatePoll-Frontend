import {Component, Input, OnInit} from '@angular/core';
import {Response} from '@angular/http';
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

  @Input('movie') movie: Movie;
  moviesSubscription: Subscription;
  soldOut: boolean;

  constructor(private dialog: MatDialog,
              private cinemaService: CinemaService,
              private myUserService: MyUserService,
              private httpService: HttpService) { }

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

  applyForWorker() {
    this.httpService.loggedInV1POSTRequest('/cinema/worker/' + this.movie.getID(), {}, 'applyForWorker').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.cinemaService.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  signOutForWorker() {
    this.httpService.loggedInV1DELETERequest('/cinema/worker/' + this.movie.getID(), 'signOutForWorker').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.cinemaService.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  applyForEmergencyWorker() {
    this.httpService.loggedInV1POSTRequest('/cinema/emergencyWorker/' + this.movie.getID(), {}, 'applyForEmergencyWorker').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.cinemaService.fetchNotShownMovies();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  signOutForEmergencyWorker() {
    this.httpService.loggedInV1DELETERequest('/cinema/emergencyWorker/' + this.movie.getID(), 'signOutForEmergencyWorker').subscribe(
      (response: Response) => {
        const data = response.json();
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
