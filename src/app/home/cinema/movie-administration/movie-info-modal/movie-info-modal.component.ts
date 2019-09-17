import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {Movie, MovieBookingUser} from '../../models/movie.model';
import {CinemaService} from '../../cinema.service';

@Component({
  selector: 'app-movie-info-modal',
  templateUrl: './movie-info-modal.component.html',
  styleUrls: ['./movie-info-modal.component.css']
})
export class MovieInfoModalComponent implements OnDestroy {
  movie: Movie;
  movieSubscription: Subscription;

  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;

  bookings: MatTableDataSource<MovieBookingUser>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cinemaService: CinemaService) {
    this.movie = data.movie;
    this.refresh();

    this.cinemaService.getMovie(this.movie.id);
    this.movieSubscription = this.cinemaService.movieChange.subscribe((movie: Movie) => {
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

    this.bookings = new MatTableDataSource<MovieBookingUser>(this.movie.getBookingUsers());
  }
}
