import { Component, OnInit } from '@angular/core';
import {CinemaService, Movie} from '../cinema.service';

@Component({
  selector: 'app-movie-tickets',
  templateUrl: './movie-tickets.component.html',
  styleUrls: ['./movie-tickets.component.css']
})
export class MovieTicketsComponent implements OnInit {

  movies: Movie[];

  constructor(private cinemaService: CinemaService) {
    this.movies = this.cinemaService.getNotShownMovies();
  }

  ngOnInit() {
  }

}
