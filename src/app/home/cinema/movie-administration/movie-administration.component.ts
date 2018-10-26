import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {CinemaService} from '../cinema.service';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.css']
})
export class MovieAdministrationComponent implements OnInit {
  rows = [];

  temp = [];

  columns = [
    { name: 'Name' },
    { name: 'Date' },
    { name: 'Trailer' },
    { name: 'Poster' },
    { name: 'Worker' },
    { name: 'E Worker' },
    { name: 'Bookedtickets' },
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private cinemaService: CinemaService) {
    // this.fetch((data) => {
    //   // cache our list
    //   this.temp = [...data];
    //
    //   // push our inital complete list
    //   this.rows = data;
    // });

    console.log(this.cinemaService.getMovies());

    for (let i = 0; i < this.cinemaService.getMovies().length; i++) {
      const movie = this.cinemaService.getMovies()[i];

      this.rows.push({name: movie.getName(),
        date: movie.getDate(),
        trailer: movie.getTrailerlink(),
        poster: movie.getImageLink(),
        worker: movie.getWorker().getFirstname(),
        eworker: movie.getEmergencyWorker().getFirstname(), bookedtickets: movie.getBookedTickets()});

      this.temp.push({name: movie.getName(),
        date: movie.getDate(),
        trailer: movie.getTrailerlink(),
        poster: movie.getImageLink(),
        worker: movie.getWorker().getFirstname(),
        eworker: movie.getEmergencyWorker().getFirstname(), bookedtickets: movie.getBookedTickets()});
    }
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `https://swimlane.github.io/ngx-datatable/assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit(): void {
  }

}
