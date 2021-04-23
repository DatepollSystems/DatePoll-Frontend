import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSelect} from '@angular/material/select';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

import {MyUserService} from '../../my-user.service';
import {CinemaService} from '../cinema.service';
import {TranslateService} from '../../../translation/translate.service';

import {Movie} from '../models/movie.model';

import {MovieBookingsModalComponent} from './movie-bookings-modal/movie-bookings-modal.component';
import {MovieCreateModalComponent} from './movie-create-modal/movie-create-modal.component';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from './movie-info-modal/movie-info-modal.component';
import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {UIHelper} from '../../../utils/helper/UIHelper';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.css'],
})
export class MovieAdministrationComponent implements OnInit, AfterViewInit, OnDestroy {
  protected _onDestroy = new Subject<void>();
  @ViewChild('yearSelect', {static: true}) yearSelect: MatSelect;
  public yearCtrl: FormControl = new FormControl();
  public yearFilterCtrl: FormControl = new FormControl();
  public filteredYears: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  private yearsSubscription: Subscription;
  private years: string[];
  private selectedYear: string = null;

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
      this.filteredYears.next(this.years.slice());
      this.selectedYear = this.years[this.years.length - 1];
      for (const year of this.years) {
        if (year.includes(UIHelper.getCurrentDate().getFullYear().toString())) {
          console.log('in');
          this.selectedYear = year;
          break;
        }
      }
      this.yearCtrl.setValue(this.selectedYear);
      this.setInitialValue();

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

  ngOnInit() {
    this.yearCtrl.setValue(this.years[1]);

    // load the initial years list
    this.filteredYears.next(this.years.slice());

    // listen for search field value changes
    this.yearFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterYears();
    });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this.moviesSubscription.unsubscribe();
    this.yearsSubscription.unsubscribe();
    this._onDestroy.next();
    this._onDestroy.complete();
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

  private setInitialValue() {
    this.filteredYears.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
      // setting the compareWith property to a comparison function
      // triggers initializing the selection according to the initial value of
      // the form control (i.e. _initializeSelection())
      // this needs to be done after the filteredYears are loaded initially
      // and after the mat-option elements are available
      this.yearSelect.compareWith = (a: string, b: string) => a && b && a === b;
    });
  }

  private filterYears() {
    if (!this.years) {
      return;
    }
    // get the search keyword
    let search = this.yearFilterCtrl.value;
    if (!search) {
      this.filteredYears.next(this.years.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the years
    this.filteredYears.next(this.years.filter((year) => year.toLowerCase().indexOf(search) > -1));
  }
}
