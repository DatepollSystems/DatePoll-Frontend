import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {CinemaService} from '../../cinema.service';
import {Movie, MovieBookingUser} from '../../models/movie.model';
import {Converter} from '../../../../services/converter';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-movie-edit-modal',
  templateUrl: './movie-edit-modal.component.html',
  styleUrls: ['./movie-edit-modal.component.css']
})
export class MovieEditModalComponent implements OnDestroy {
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

  save() {
    const year = this.date.getFullYear();

    const years = this.cinemaService.getYears();
    let yearID = null;

    for (let i = 0; i < years.length; i++) {
      if (years[i].year.toString().toLowerCase() === year.toString().toLowerCase()) {
        yearID = years[i].id;
        break;
      }
    }

    if (yearID === null) {
      console.log('updateMovie | no yearID found!');
      const yearObject = {'year': year};
      this.cinemaService.addYear(yearObject).subscribe(
        (data: any) => {
          console.log(data);
          yearID = data.year.id;
          console.log('updateMovie | yearID: ' + yearID);
          this.cinemaService.fetchYears();
          this.updateMovie(yearID);
        },
        (error) => console.log(error)
      );
    } else {
      console.log('updateMovie | Using existing yearID');
      this.updateMovie(yearID);
    }
  }

  updateMovie(yearID: number) {
    const movieObject = {
      'name': this.name,
      'date': Converter.getDateFormatted(this.date),
      'trailerLink': this.trailerLink,
      'posterLink': this.imageLink,
      'bookedTickets': this.bookedTickets,
      'movie_year_id': yearID
    };
    console.log(movieObject);
    this.cinemaService.updateMovie(this.movie.id, movieObject).subscribe(
      (data: any) => {
        console.log(data);
        this.cinemaService.fetchMovies();
        this.cinemaService.fetchNotShownMovies();
      },
      (error) => console.log(error)
    );
  }
}
