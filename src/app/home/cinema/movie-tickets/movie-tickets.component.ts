import { Component, OnInit } from '@angular/core';
import {CinemaService} from '../cinema.service';
import {Subscription} from 'rxjs';
import {Movie} from '../movie';
import {SettingsService} from '../../../settings.service';

@Component({
  selector: 'app-movie-tickets',
  templateUrl: './movie-tickets.component.html',
  styleUrls: ['./movie-tickets.component.css']
})
export class MovieTicketsComponent implements OnInit {

  movies: Movie[];
  private moviesSubscription: Subscription;

  constructor(private cinemaService: CinemaService, private settingsService: SettingsService) {
    this.movies = this.cinemaService.getNotShownMovies();

    this.moviesSubscription = cinemaService.notShownMoviesChange.subscribe((value) => {
      this.movies = value;
    });
  }

  ngOnInit() {
    this.settingsService.checkShowCinema();
  }

}
