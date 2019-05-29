import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';

import {Movie, MovieBookingUser} from '../../movie.model';

@Component({
  selector: 'app-movie-info-modal',
  templateUrl: './movie-info-modal.component.html',
  styleUrls: ['./movie-info-modal.component.css']
})
export class MovieInfoModalComponent {
  movie: Movie;

  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;

  bookings: MovieBookingUser[];

  displayedColumns: string[] = ['name', 'amount'];
  dataSource: MatTableDataSource<MovieBookingUser>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.movie = data.movie;

    this.id = this.movie.id;
    this.name = this.movie.name;
    this.date = this.movie.date;
    this.trailerLink = this.movie.trailerLink;
    this.imageLink = this.movie.posterLink;
    this.bookedTickets = this.movie.bookedTickets;
    this.bookings = this.movie.getBookingUsers();

    this.dataSource = new MatTableDataSource(this.bookings);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
