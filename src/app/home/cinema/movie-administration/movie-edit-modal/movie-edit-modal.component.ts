import {Component, Inject} from '@angular/core';
import {CinemaService} from '../../cinema.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Movie} from '../../movie.model';
import {Response} from '@angular/http';

@Component({
  selector: 'app-movie-edit-modal',
  templateUrl: './movie-edit-modal.component.html',
  styleUrls: ['./movie-edit-modal.component.css']
})
export class MovieEditModalComponent {

  movie: Movie;

  id: number;
  name: string;
  date: Date;
  trailerLink: string;
  imageLink: string;
  bookedTickets: number;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cinemaService: CinemaService) {
    this.movie = data.movie;

    this.id = this.movie.getID();
    this.name = this.movie.getName();
    this.date = this.movie.getDate();
    this.trailerLink = this.movie.getTrailerlink();
    this.imageLink = this.movie.getImageLink();
    this.bookedTickets = this.movie.getBookedTickets();
  }

  save() {
    const year = this.date.getFullYear();

    const years = this.cinemaService.getYears();
    let yearID = null;

    for (let i = 0; i < years.length; i++) {
      if (years[i].getYear().toString().toLowerCase() === year.toString().toLowerCase()) {
        yearID = years[i].getID();
        break;
      }
    }

    if (yearID === null) {
      console.log('updateMovie | no yearID found!');
      const yearObject = {'year': year};
      this.cinemaService.addYear(yearObject).subscribe(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          yearID = data.year.id;
          console.log('updateMovie | yearID: ' + yearID);
          this.cinemaService.fetchYears();
          this.updateMovie(yearID);
        },
        (error) => console.log(error)
      );
    } else {
      console.log('updateMovie | Using existing yearID');
      this.updateMovie(yearID);
    }
  }

  updateMovie(yearID: number) {
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
    this.cinemaService.updateMovie(this.movie.getID(), movieObject).subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.cinemaService.fetchMovies();
      },
      (error) => console.log(error)
    );
  }
}
