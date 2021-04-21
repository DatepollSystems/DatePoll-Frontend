import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

import {CinemaService} from '../../cinema.service';
import {TranslateService} from '../../../../translation/translate.service';
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

  constructor(private cinemaService: CinemaService, private snackBar: MatSnackBar, private translate: TranslateService) {}

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
        this.snackBar.open(this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_CREATE_SUCCESSFULLY'));
      },
      (error) => console.log(error)
    );
  }
}
