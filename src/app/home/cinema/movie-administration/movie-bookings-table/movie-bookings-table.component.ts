import {Component, Input} from '@angular/core';
import {MovieBookingUser} from '../../models/movie.model';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-movie-bookings-table',
  templateUrl: './movie-bookings-table.component.html',
  styleUrls: ['./movie-bookings-table.component.css']
})
export class MovieBookingsTableComponent {
  displayedColumns: string[] = ['name', 'amount'];
  @Input()
  bookings: MatTableDataSource<MovieBookingUser>;

  @Input()
  bookedTickets: number;

  constructor() { }

  applyFilter(filterValue: string) {
    this.bookings.filter = filterValue.trim().toLowerCase();
  }
}
