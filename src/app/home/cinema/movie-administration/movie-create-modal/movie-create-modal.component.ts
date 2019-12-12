import {Component} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';

import {CinemaService} from '../../cinema.service';
import {TranslateService} from '../../../../translation/translate.service';
import {Converter} from '../../../../services/converter';

@Component({
  selector: 'app-movie-create-modal',
  templateUrl: './movie-create-modal.component.html',
  styleUrls: ['./movie-create-modal.component.css']
})
export class MovieCreateModalComponent {
  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;

  constructor(private cinemaService: CinemaService,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
  }

  create() {
    const year = this.date.getFullYear();

    const years = this.cinemaService.getYears();
    let yearID = null;

    for (let i = 0; i < years.length; i++) {
      if (years[i].year.toString().toLowerCase() === year.toString().toLowerCase()) {
        yearID = years[i].id;
        break;
      }
    }

    if (yearID === null) {
      console.log('createMovie | no yearID found!');
      const yearObject = {'year': year};
      this.cinemaService.addYear(yearObject).subscribe(
        (data: any) => {
          console.log(data);
          yearID = data.year.id;
          console.log('createMovie | yearID: ' + yearID);
          this.cinemaService.fetchYears();
          this.addMovie(yearID);
        },
        (error) => console.log(error)
      );
    } else {
      console.log('createMovie | Using existing yearID');
      this.addMovie(yearID);
    }
  }

  addMovie(yearID: number) {
    const movieObject = {
      'name': this.name,
      'date': Converter.getDateFormatted(this.date),
      'trailer_link': this.trailerLink,
      'poster_link': this.imageLink,
      'booked_tickets': this.bookedTickets,
      'movie_year_id': yearID
    };
    console.log(movieObject);
    this.cinemaService.addMovie(movieObject).subscribe(
      (data: any) => {
        console.log(data);
        this.cinemaService.fetchMovies();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_CREATE_SUCCESSFULLY'));
      },
      (error) => console.log(error)
    );
  }
}
