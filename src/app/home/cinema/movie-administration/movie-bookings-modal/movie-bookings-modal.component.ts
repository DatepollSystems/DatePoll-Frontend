import {Component, Inject, OnDestroy} from '@angular/core';
import {Movie, MovieBookingUser} from '../../models/movie.model';
import { Subscription } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CinemaService} from '../../cinema.service';
import {SelectionModel} from '@angular/cdk/collections';
import {EventResultUser} from '../../../events/models/event-result-user.model';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../../../../translation/translate.service';
import {EventsVoteForDecisionModalComponent} from '../../../events/events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';

@Component({
  selector: 'app-movie-bookings-modal',
  templateUrl: './movie-bookings-modal.component.html',
  styleUrls: ['./movie-bookings-modal.component.css']
})
export class MovieBookingsModalComponent implements OnDestroy {
  displayedColumns: string[] = ['select', 'name', 'amount'];
  loading = true;

  movie: Movie;
  movieSubscription: Subscription;

  bookedTickets = 0;
  bookings: MatTableDataSource<MovieBookingUser>;
  selection = new SelectionModel<MovieBookingUser>(true, []);

  name = '';

  savingBooking = false;
  savingClearBooking = false;
  ticketsToBook = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private cinemaService: CinemaService,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
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
    this.name = this.movie.name;
    this.bookedTickets = this.movie.bookedTickets;

    this.bookings = new MatTableDataSource<MovieBookingUser>(this.movie.getBookingUsers());
  }

  onBook() {
    if (this.ticketsToBook < 1) {
      return;
    }

    const selected = this.selection.selected.slice();
    console.log('movieBookingsModal | Selected MovieBookingUser: ' + selected);
    if (this.selection.selected.length === 0) {
      this.notificationsService.warn(this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_BOOK_NO_ONE_SELECTED'));
      return;
    }

    for (const booking of selected) {
      booking.amount = this.ticketsToBook;
    }
    this.ticketsToBook = 1;

    this.savingBooking = true;
    this.cinemaService.bookForUsers(selected, this.movie.id).subscribe(
      (response: any) => {
        console.log(response);

        this.savingBooking = false;
        this.selection.clear();
        this.loading = true;
        this.cinemaService.getMovie(this.movie.id);
        this.cinemaService.fetchMovies();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_BOOK_SUCCESSFULLY'));
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
    this.selection.clear();
  }

  onClear() {
    console.log('movieBookingsModal | Selected MovieBookingUser: ' + this.selection.selected);
    if (this.selection.selected.length === 0) {
      this.notificationsService.warn(this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_BOOK_NO_ONE_SELECTED'));
      return;
    }
    this.savingClearBooking = true;
    this.cinemaService.cancelBookingForUsers(this.selection.selected, this.movie.id).subscribe(
      (response: any) => {
        console.log(response);

        this.savingClearBooking = false;
        this.selection.clear();
        this.loading = true;
        this.cinemaService.getMovie(this.movie.id);
        this.cinemaService.fetchMovies();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_BOOKINGS_MANAGEMENT_MODAL_REMOVE_BOOKING_SUCCESSFULLY'));
      },
      (error) => {
        console.log(error);
        this.cinemaService.getMovie(this.movie.id);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.bookings.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.bookings.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.bookings.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MovieBookingUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.firstname + ' ' + row.surname}`;
  }

}
