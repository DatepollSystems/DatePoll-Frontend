import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Subscription} from 'rxjs';

import {MyUserService} from '../../my-user.service';
import {CinemaService} from '../cinema.service';
import {TranslateService} from '../../../translation/translate.service';
import {UIHelper} from '../../../utils/helper/UIHelper';

import {Movie} from '../models/movie.model';

import {MovieBookingsModalComponent} from './movie-bookings-modal/movie-bookings-modal.component';
import {MovieCreateModalComponent} from './movie-create-modal/movie-create-modal.component';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from './movie-info-modal/movie-info-modal.component';
import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {YearSelectComponent} from '../../../utils/shared-components/year-select/year-select.component';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.css'],
})
export class MovieAdministrationComponent implements OnDestroy {
  private years: string[];
  private yearsSubscription: Subscription;
  private selectedYear: string = null;
  @ViewChild(YearSelectComponent) yearSelect: YearSelectComponent;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['name', 'date', 'trailer', 'poster', 'worker', 'emergencyWorker', 'bookedTickets', 'deleteMovie'];
  filterValue: string = null;
  dataSource: MatTableDataSource<Movie>;
  moviesLoaded = false;
  private moviesSubscription: Subscription;
  private movies: Movie[];

  constructor(
    private cinemaService: CinemaService,
    private myUserService: MyUserService,
    private router: Router,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.years = this.cinemaService.getYears();
    this.selectedYear = this.years[this.years.length - 1];
    this.yearsSubscription = cinemaService.yearsChange.subscribe((value) => {
      this.years = value;
      this.selectedYear = this.years[this.years.length - 1];
      for (const year of this.years) {
        if (year.includes(UIHelper.getCurrentDate().getFullYear().toString())) {
          console.log('in');
          this.selectedYear = year;
          break;
        }
      }

      this.yearSelect.initialize(this.selectedYear, this.years);

      this.moviesLoaded = false;
      this.movies = cinemaService.getMovies(Number(this.selectedYear));
      this.refreshTable();

      if (this.movies.length > 0) {
        this.moviesLoaded = true;
      }

      this.moviesSubscription = this.cinemaService.moviesChange.subscribe((eValue) => {
        this.movies = eValue;
        this.moviesLoaded = true;
        this.refreshTable();
      });
    });
  }

  ngOnDestroy() {
    this.moviesSubscription.unsubscribe();
    this.yearsSubscription.unsubscribe();
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.movies);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  onCreate() {
    this.dialog.open(MovieCreateModalComponent, {
      width: '80vh',
    });
  }

  onEdit(movie: Movie) {
    this.dialog.open(MovieEditModalComponent, {
      width: '80vh',
      data: {movie},
    });
  }

  onBookings(movie: Movie) {
    this.dialog.open(MovieBookingsModalComponent, {
      width: '80vh',
      data: {movie},
    });
  }

  onInfo(movie: Movie) {
    this.dialog.open(MovieInfoModalComponent, {
      width: '80vh',
      data: {movie},
    });
  }

  deleteMovie(id: number) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'CINEMA_TICKETS_ADMINISTRATION_MOVIE_DELETE_MODAL_TITLE',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.cinemaService.deleteMovie(id).subscribe(
          (data: any) => {
            console.log(data);
            this.cinemaService.fetchMovies();
            this.snackBar.open(this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_DELETE_MODAL_SUCCESSFULLY_DELETED'));
          },
          (error) => console.log(error)
        );
      }
    });
  }

  refreshMovies() {
    this.moviesLoaded = false;
    this.movies = [];
    this.years = [];
    this.refreshTable();
    this.cinemaService.getYears();
    this.cinemaService.fetchMovies();
  }

  yearSelectChange(value) {
    this.selectedYear = value;
    this.cinemaService.getMovies(value);
  }
}
