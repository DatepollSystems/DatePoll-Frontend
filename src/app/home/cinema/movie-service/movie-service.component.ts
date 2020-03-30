import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../../utils/settings.service';
import {MovieOrder, MovieTicketsService} from '../movieTickets.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-movie-service',
  templateUrl: './movie-service.component.html',
  styleUrls: ['./movie-service.component.css']
})
export class MovieServiceComponent implements OnInit, OnDestroy {
  movieOrders: MovieOrder[];
  movieOrdersSubscription: Subscription;

  constructor(private settingsService: SettingsService, private movieTicketsService: MovieTicketsService) {
    this.movieOrders = movieTicketsService.getMovieOrders();
    this.movieOrdersSubscription = this.movieTicketsService.movieOrdersChange.subscribe(value => {
      this.movieOrders = value;
    });
  }

  ngOnInit() {
    this.settingsService.checkShowCinema();
  }

  ngOnDestroy() {
    this.movieOrdersSubscription.unsubscribe();
  }
}
