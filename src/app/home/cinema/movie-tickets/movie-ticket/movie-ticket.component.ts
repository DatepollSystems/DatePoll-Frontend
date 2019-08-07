import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {HttpService} from '../../../../services/http.service';
import {MyUserService} from '../../../my-user.service';
import {CinemaService} from '../../cinema.service';

import {MovieBookTicketsModalComponent} from './movie-book-tickets-modal/movie-book-tickets-modal.component';
import {Movie} from '../../models/movie.model';
import {MovieWeatherforecastModalComponent} from './movie-weatherforecast-modal/movie-weatherforecast-modal.component';

@Component({
  selector: 'app-movie-ticket',
  templateUrl: './movie-ticket.component.html',
  styleUrls: ['./movie-ticket.component.css']
})
export class MovieTicketComponent implements OnInit {
  @Input()
  movie: Movie;

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
  }

  bookTickets() {
    this.dialog.open(MovieBookTicketsModalComponent, {
      width: '60vh',
      data: {movie: this.movie},
    });
  }

  cancelTickets(element: any) {
    element.disabled = true;
    this.httpService.loggedInV1DELETERequest('/cinema/booking/' + this.movie.id, 'cancelTickets').subscribe(
      (data: any) => {
        console.log(data);
        this.movie.bookedTickets -= this.movie.bookedTicketsForYourself;
        this.movie.bookedTicketsForYourself = 0;
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  openWeatherForecastModal() {
    this.dialog.open(MovieWeatherforecastModalComponent, {
      width: '80vh',
      data: {movie: this.movie}
    });
  }

  applyForWorker(element) {
    element.disabled = true;
    this.cinemaService.applyForWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.movie.workerName = this.myUserService.getFirstname() + ' ' + this.myUserService.getSurname();
        this.movie.workerID = this.myUserService.getID();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  signOutForWorker(element) {
    element.disabled = true;
    this.cinemaService.signOutForWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.movie.workerName = null;
        this.movie.workerID = -1;
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  applyForEmergencyWorker(element) {
    element.disabled = true;
    this.cinemaService.applyForEmergencyWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.movie.emergencyWorkerName = this.myUserService.getFirstname() + ' ' + this.myUserService.getSurname();
        this.movie.emergencyWorkerID = this.myUserService.getID();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  signOutForEmergencyWorker(element) {
    element.disabled = true;
    this.cinemaService.signOutForEmergencyWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.movie.emergencyWorkerName = null;
        this.movie.emergencyWorkerID = -1;
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }
}
