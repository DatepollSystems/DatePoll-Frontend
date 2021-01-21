import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {MovieOrder, MovieTicketsService} from '../movieTickets.service';

@Component({
  selector: 'app-movie-service',
  templateUrl: './movie-service.component.html',
  styleUrls: ['./movie-service.component.css'],
})
export class MovieServiceComponent implements OnDestroy {
  movieOrders: MovieOrder[];
  movieOrdersSubscription: Subscription;

  constructor(private movieTicketsService: MovieTicketsService) {
    this.movieOrders = movieTicketsService.getMovieOrders();
    this.movieOrdersSubscription = this.movieTicketsService.movieOrdersChange.subscribe((value) => {
      this.movieOrders = value;
    });
  }

  ngOnDestroy() {
    this.movieOrdersSubscription.unsubscribe();
  }
}
