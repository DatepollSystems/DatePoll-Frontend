import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {CinemaService} from '../cinema.service';
import {SettingsService} from '../../../utils/settings.service';

import {Movie} from '../models/movie.model';

@Component({
  selector: 'app-movie-tickets',
  templateUrl: './movie-tickets.component.html',
  styleUrls: ['./movie-tickets.component.css']
})
export class MovieTicketsComponent implements OnInit, OnDestroy {
  movies: Movie[] = null;
  private moviesSubscription: Subscription;

  constructor(private cinemaService: CinemaService, private settingsService: SettingsService) {
    this.movies = this.cinemaService.getNotShownMovies();

    this.moviesSubscription = cinemaService.notShownMoviesChange.subscribe(value => {
      this.movies = value;
    });
  }

  ngOnInit() {
    this.settingsService.checkShowCinema();
  }

  ngOnDestroy() {
    this.moviesSubscription.unsubscribe();
  }
}
