import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {HttpService} from '../../../../utils/http.service';
import {MyUserService} from '../../../my-user.service';
import {CinemaUserService} from '../../cinema-user.service';

import {MovieBookTicketsModalComponent} from './movie-book-tickets-modal/movie-book-tickets-modal.component';
import {MovieWeatherforecastModalComponent} from './movie-weatherforecast-modal/movie-weatherforecast-modal.component';

import {Movie} from '../../models/movie.model';

@Component({
  selector: 'app-movie-ticket',
  templateUrl: './movie-ticket.component.html',
  styleUrls: ['./movie-ticket.component.css'],
})
export class MovieTicketComponent {
  @Input()
  movie: Movie;
  @Input()
  listView = false;

  soldOut: boolean;

  applyingForWorker = false;
  signingOutForWorker = false;

  applyingForEmergencyWorker = false;
  signingOutForEmergencyWorker = false;

  myUserService: MyUserService;

  constructor(
    private dialog: MatDialog,
    private cinemaService: CinemaUserService,
    myUserService: MyUserService,
    private httpService: HttpService
  ) {
    this.myUserService = myUserService;
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

        let check = false;
        if (this.movie.bookedTickets === 20 || this.movie.bookedTickets === 0) {
          check = true;
        }
        this.movie.bookedTickets -= this.movie.bookedTicketsForYourself;
        this.movie.bookedTicketsForYourself = 0;
        this.soldOut = this.movie.bookedTickets >= 20;

        if (check) {
          this.cinemaService.fetchNotShownMovies();
        }
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
      data: {movie: this.movie},
    });
  }

  applyForWorker() {
    this.applyingForWorker = true;
    this.cinemaService.applyForWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.applyingForWorker = false;
        this.movie.workerName = this.myUserService.getFirstname() + ' ' + this.myUserService.getSurname();
        this.movie.workerID = this.myUserService.getID();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  signOutForWorker() {
    this.signingOutForWorker = true;
    this.cinemaService.signOutForWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.signingOutForWorker = false;
        this.movie.workerName = null;
        this.movie.workerID = -1;
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  applyForEmergencyWorker() {
    this.applyingForEmergencyWorker = true;
    this.cinemaService.applyForEmergencyWorker(this.movie.id).subscribe(
      (response: any) => {
        console.log(response);
        this.applyingForEmergencyWorker = false;
        this.movie.emergencyWorkerName = this.myUserService.getFirstname() + ' ' + this.myUserService.getSurname();
        this.movie.emergencyWorkerID = this.myUserService.getID();
      },
      (error) => {
        console.log(error);
        this.cinemaService.fetchNotShownMovies();
      }
    );
  }

  signOutForEmergencyWorker() {
    this.signingOutForEmergencyWorker = true;
    this.cinemaService.signOutForEmergencyWorker(this.movie.id).subscribe(
      (response: any) => {
        this.signingOutForEmergencyWorker = false;
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
