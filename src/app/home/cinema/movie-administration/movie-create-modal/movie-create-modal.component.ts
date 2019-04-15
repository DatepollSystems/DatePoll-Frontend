import {Component} from '@angular/core';
import {CinemaService} from '../../cinema.service';
import {Response} from '@angular/http';

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

  constructor(private cinemaService: CinemaService) {
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
    const d = new Date(this.date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const dateformat = [year, month, day].join('-');

    const movieObject = {
      'name': this.name,
      'date': dateformat,
      'trailerLink': this.trailerLink,
      'posterLink': this.imageLink,
      'bookedTickets': this.bookedTickets,
      'movie_year_id': yearID
    };
    console.log(movieObject);
    this.cinemaService.addMovie(movieObject).subscribe(
      (data: any) => {
        console.log(data);
        this.cinemaService.fetchMovies();
      },
      (error) => console.log(error)
    );
  }
}
