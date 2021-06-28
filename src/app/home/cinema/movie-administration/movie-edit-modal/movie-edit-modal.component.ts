import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {CinemaService} from '../../cinema.service';
import {Converter} from '../../../../utils/helper/Converter';
import {NotificationService} from '../../../../utils/notification.service';

import {Movie} from '../../models/movie.model';

@Component({
  selector: 'app-movie-edit-modal',
  templateUrl: './movie-edit-modal.component.html',
  styleUrls: ['./movie-edit-modal.component.css'],
})
export class MovieEditModalComponent implements OnDestroy {
  loading = true;

  movie: Movie;
  movieSubscription: Subscription;

  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;
  maximalTickets: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cinemaService: CinemaService,
    private notficationService: NotificationService
  ) {
    this.movie = data.movie;
    this.refresh();

    this.cinemaService.getMovie(this.movie.id);
    this.movieSubscription = this.cinemaService.movieChange.subscribe((movie: Movie) => {
      this.loading = false;
      this.movie = movie;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }

  private refresh() {
    this.id = this.movie.id;
    this.name = this.movie.name;
    this.date = this.movie.date;
    this.trailerLink = this.movie.trailerLink;
    this.imageLink = this.movie.posterLink;
    this.bookedTickets = this.movie.bookedTickets;
    this.maximalTickets = this.movie.maximalTickets;

    const localBookings = [];
    for (const booking of this.movie.getBookingUsers()) {
      if (booking.amount > 0) {
        localBookings.push(booking);
      }
    }
  }

  save() {
    const movieObject = {
      name: this.name,
      date: Converter.getDateFormatted(this.date),
      trailer_link: this.trailerLink,
      poster_link: this.imageLink,
      booked_tickets: this.bookedTickets,
      maximal_tickets: this.maximalTickets,
    };
    console.log(movieObject);
    this.cinemaService.updateMovie(this.movie.id, movieObject).subscribe(
      (data: any) => {
        console.log(data);
        this.cinemaService.fetchMovies();
        this.notficationService.info('CINEMA_TICKETS_ADMINISTRATION_MOVIE_UPDATE_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }
}
