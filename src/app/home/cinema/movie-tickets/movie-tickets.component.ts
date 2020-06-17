import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../../utils/settings.service';
import {CinemaService} from '../cinema.service';

import {Movie} from '../models/movie.model';

@Component({
  selector: 'app-movie-tickets',
  templateUrl: './movie-tickets.component.html',
  styleUrls: ['./movie-tickets.component.css']
})
export class MovieTicketsComponent implements OnInit, OnDestroy {
  movies: Movie[] = null;
  moviesCopy: Movie[] = null;
  private moviesSubscription: Subscription;

  searchFilter = '';
  listView = true;

  constructor(private cinemaService: CinemaService, private settingsService: SettingsService) {
    this.movies = this.cinemaService.getNotShownMovies();
    if (this.movies != null) {
      this.moviesCopy = this.movies.slice();
    }

    this.moviesSubscription = cinemaService.notShownMoviesChange.subscribe(value => {
      this.movies = value;
      if (this.movies != null) {
        this.moviesCopy = this.movies.slice();
      }
    });
  }

  ngOnInit() {
    this.settingsService.checkShowCinema();
  }

  ngOnDestroy() {
    this.moviesSubscription.unsubscribe();
  }

  toggle() {
    this.listView = !this.listView;
  }

  searchFilterUpdate(event) {
    this.moviesCopy = [];
    for (const movie of this.movies) {
      if (movie.name.toLocaleLowerCase().includes(this.searchFilter.toLocaleLowerCase())) {
        this.moviesCopy.push(movie);
      }
    }
  }
}
