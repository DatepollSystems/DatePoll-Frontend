import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';

import {CinemaService} from '../../cinema.service';
import {NotificationService} from '../../../../utils/notification.service';

import {Movie, MovieBookingUser} from '../../models/movie.model';

@Component({
  selector: 'app-movie-bookings-modal',
  templateUrl: './movie-bookings-modal.component.html',
  styleUrls: ['./movie-bookings-modal.component.css'],
})
export class MovieBookingsModalComponent implements OnDestroy {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['select', 'name', 'amount'];
  bookings: MatTableDataSource<MovieBookingUser>;
  selection = new SelectionModel<MovieBookingUser>(true, []);
  filterValue = '';
  movie: Movie;
  movieSubscription: Subscription;

  loading = true;

  savingBooking = false;
  savingClearBooking = false;
  ticketsToBook = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cinemaService: CinemaService,
    private notificationService: NotificationService
  ) {
    this.movie = data.movie;
    this.refresh();

    this.cinemaService.getMovie(this.movie.id);
    this.movieSubscription = this.cinemaService.movieChange.subscribe((movie: Movie) => {
      this.loading = false;
      this.movie = movie;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }

  private refresh() {
    this.bookings = new MatTableDataSource<MovieBookingUser>(this.movie.getBookingUsers());
    this.bookings.sort = this.sort;
    this.bookings.paginator = this.paginator;
  }

  onBook() {
    if (this.ticketsToBook < 1) {
      return;
    }

    const selected = [];
    for (const booking of this.selection.selected) {
      selected.push(new MovieBookingUser(booking.userID, booking.firstname, booking.surname, booking.amount));
    }
    console.log('movieBookingsModal | Selected MovieBookingUser: ' + selected);
    if (this.selection.selected.length === 0) {
      this.notificationService.info('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_BOOK_NO_ONE_SELECTED');
      return;
    }

    for (const booking of selected) {
      booking.amount = this.ticketsToBook;
    }

    this.savingBooking = true;
    this.cinemaService.bookForUsers(selected, this.movie.id).subscribe(
      (response: any) => {
        console.log(response);

        this.savingBooking = false;

        for (const booking of this.selection.selected) {
          booking.amount += this.ticketsToBook;
        }
        this.ticketsToBook = 1;
        this.selection.clear();
        this.cinemaService.fetchMovies();

        this.notificationService.info('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_BOOK_SUCCESSFULLY');
      },
      (error) => {
        console.log(error);
        this.cinemaService.getMovie(this.movie.id);
      }
    );
  }

  onBookForSingle(user: MovieBookingUser) {
    this.selection.select(user);
    this.onBook();
  }

  onClear() {
    console.log('movieBookingsModal | Selected MovieBookingUser: ' + this.selection.selected);
    if (this.selection.selected.length === 0) {
      this.notificationService.info('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_BOOK_NO_ONE_SELECTED');
      return;
    }
    this.savingClearBooking = true;
    this.cinemaService.cancelBookingForUsers(this.selection.selected.slice(), this.movie.id).subscribe(
      (response: any) => {
        console.log(response);

        this.savingClearBooking = false;
        for (const booking of this.selection.selected) {
          booking.amount = 0;
        }
        this.selection.clear();
        this.cinemaService.fetchMovies();
        this.notificationService.info('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_REMOVE_BOOKING_SUCCESSFULLY');
      },
      (error) => {
        console.log(error);
        this.cinemaService.getMovie(this.movie.id);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.bookings.filter = filterValue.trim().toLowerCase();
    this.filterValue = this.bookings.filter.slice();

    this.bookings.sort = this.sort;

    if (this.bookings.paginator) {
      this.bookings.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.bookings.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.bookings.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MovieBookingUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.firstname + ' ' + row.surname}`;
  }
}
