import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {CinemaUserService} from '../cinema-user.service';
import {Converter} from '../../../utils/converter';

import {Movie} from '../models/movie.model';

@Component({
  selector: 'app-movie-tickets',
  templateUrl: './movie-tickets.component.html',
  styleUrls: ['./movie-tickets.component.css'],
})
export class MovieTicketsComponent implements OnDestroy {
  private static storageViewModeKey = 'movie_list_view_mode';

  movies: Movie[] = null;
  moviesCopy: Movie[] = null;
  private moviesSubscription: Subscription;

  searchFilter = '';
  listView = false;

  constructor(private cinemaService: CinemaUserService) {
    this.movies = this.cinemaService.getNotShownMovies();
    if (this.movies != null) {
      this.moviesCopy = this.movies.slice();
    }

    this.moviesSubscription = cinemaService.notShownMoviesChange.subscribe((value) => {
      this.movies = value;
      if (this.movies != null) {
        this.moviesCopy = this.movies.slice();
      }
    });

    if (localStorage.getItem(MovieTicketsComponent.storageViewModeKey) != null) {
      this.listView = Converter.stringToBoolean(localStorage.getItem(MovieTicketsComponent.storageViewModeKey));
    }
  }

  ngOnDestroy() {
    this.moviesSubscription.unsubscribe();
  }

  toggle() {
    this.listView = !this.listView;
    localStorage.setItem(MovieTicketsComponent.storageViewModeKey, Converter.booleanToString(this.listView));
  }

  searchFilterUpdate() {
    this.moviesCopy = [];
    const search = this.searchFilter.trim().toLowerCase();
    for (const movie of this.movies) {
      if (movie.name.trim().toLowerCase().includes(search) || movie.date.toDateString().trim().toLowerCase().includes(search)) {
        this.moviesCopy.push(movie);
      }
    }
  }

  trackByFn(inde, item) {
    return item.id;
  }
}
