import { Component, OnInit } from '@angular/core';
import {CinemaService, Movie} from '../../cinema.service';

@Component({
  selector: 'app-movie-edit-modal',
  templateUrl: './movie-edit-modal.component.html',
  styleUrls: ['./movie-edit-modal.component.css']
})
export class MovieEditModalComponent {

  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;

  constructor(private cinemaService: CinemaService) {

    const movie = cinemaService.getSelectedMovie();
    if (movie === null) {
      console.log('Movie is null!');
    } else {
      console.log('Movie to edit:', movie);

      this.id = movie.getID();
      this.name = movie.getName();
      this.date = movie.getDate();
      this.trailerLink = movie.getTrailerlink();
      this.imageLink = movie.getImageLink();
      this.bookedTickets = movie.getBookedTickets();
    }
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
