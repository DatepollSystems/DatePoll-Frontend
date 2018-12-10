import {Component, Inject, OnInit} from '@angular/core';
import {CinemaService, Movie} from '../../cinema.service';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-movie-edit-modal',
  templateUrl: './movie-edit-modal.component.html',
  styleUrls: ['./movie-edit-modal.component.css']
})
export class MovieEditModalComponent {

  movie: Movie;

  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cinemaService: CinemaService) {
    this.movie = data.movie;

    this.id = this.movie.getID();
    this.name = this.movie.getName();
    this.date = this.movie.getDate();
    this.trailerLink = this.movie.getTrailerlink();
    this.imageLink = this.movie.getImageLink();
    this.bookedTickets = this.movie.getBookedTickets();
  }

  save() {
    const movies = this.cinemaService.getMovies();
    let movie;

    for (let i = 0; i < movies.length; i++) {
      if (movies[i].getID() === this.id) {
        movie = movies[i];
        movie.setName(this.name);
        movie.setDate(this.date);
        movie.setTrailerLink(this.trailerLink);
        movie.setImageLink(this.imageLink);
        movie.setBookedTickets(this.bookedTickets);

        console.log('Movie updated!');
      }
    }
  }
}
