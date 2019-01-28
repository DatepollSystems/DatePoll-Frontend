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
      if (years[i].getYear().toString().toLowerCase() === year.toString().toLowerCase()) {
        yearID = years[i].getID();
        break;
      }
    }

    if (yearID === null) {
      console.log('createMovie | no yearID found!');
      const yearObject = {'year': year};
      this.cinemaService.addYear(yearObject).subscribe(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          yearID = data.year.id;
          console.log('createMovie | yearID: ' + yearID);
          this.cinemaService.checkAndFetchYears(true);
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
    const dd = this.date.getDate();
    const mm = this.date.getMonth() + 1;

    let ddd;
    let mmm;

    const yyyy = this.date.getFullYear();
    if (dd < 10) {
      ddd = '0' + dd;
    }
    if (mm < 10) {
      mmm = '0' + mm;
    }
    const dateformat = yyyy + '-' + mmm + '-' + ddd;

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
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.cinemaService.checkAndFetchMovies(true);
      },
      (error) => console.log(error)
    );
  }
}
