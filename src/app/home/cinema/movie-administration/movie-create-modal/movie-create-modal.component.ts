import {Component} from '@angular/core';

import {CinemaService} from '../../cinema.service';
import {NotificationService} from '../../../../utils/notification.service';
import {Converter} from '../../../../utils/helper/Converter';

@Component({
  selector: 'app-movie-create-modal',
  templateUrl: './movie-create-modal.component.html',
  styleUrls: ['./movie-create-modal.component.css'],
})
export class MovieCreateModalComponent {
  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;
  maximalTickets: number;

  constructor(private cinemaService: CinemaService, private notificationService: NotificationService) {}

  create() {
    const movieObject = {
      name: this.name,
      date: Converter.getDateFormatted(this.date),
      trailer_link: this.trailerLink,
      poster_link: this.imageLink,
      booked_tickets: this.bookedTickets,
      maximal_tickets: this.maximalTickets,
    };
    console.log(movieObject);
    this.cinemaService.addMovie(movieObject).subscribe(
      (data: any) => {
        console.log(data);
        this.cinemaService.fetchMovies();
        this.notificationService.info('CINEMA_TICKETS_ADMINISTRATION_MOVIE_CREATE_SUCCESSFULLY');
      },
      (error) => console.log(error)
    );
  }
}
