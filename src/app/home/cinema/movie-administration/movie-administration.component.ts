import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatBottomSheet} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {MatSelect} from '@angular/material/select';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';

import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

import {SettingsService} from '../../../services/settings.service';
import {MyUserService} from '../../my-user.service';
import {CinemaService} from '../cinema.service';

import {Movie} from '../models/movie.model';
import {Year} from '../models/year.model';

import {MovieBookingsModalComponent} from './movie-bookings-modal/movie-bookings-modal.component';
import {MovieCreateModalComponent} from './movie-create-modal/movie-create-modal.component';
import {MovieDeleteModalComponent} from './movie-delete-modal/movie-delete-modal.component';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from './movie-info-modal/movie-info-modal.component';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.css']
})
export class MovieAdministrationComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'date', 'trailer', 'poster', 'worker', 'emergencyWorker', 'bookedTickets', 'deleteMovie'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /** control for the selected years */
  public yearCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public yearFilterCtrl: FormControl = new FormControl();

  /** list of years filtered by search keyword */
  public filteredYears: ReplaySubject<Year[]> = new ReplaySubject<Year[]>(1);

  @ViewChild('yearSelect', {static: true}) yearSelect: MatSelect;
  dataSource: MatTableDataSource<Movie>;
  moviesLoaded = true;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  private moviesSubscription: Subscription;
  private movies: Movie[];
  private yearsSubscription: Subscription;
  private years: Year[];
  private selectedYear: Year = null;

  constructor(
    private cinemaService: CinemaService,
    private myUserService: MyUserService,
    private settingsService: SettingsService,
    private router: Router,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {
    this.moviesLoaded = false;

    this.years = this.cinemaService.getYears();
    this.selectedYear = this.years[this.years.length - 1];
    this.yearsSubscription = cinemaService.yearsChange.subscribe(value => {
      this.years = value;
      this.filteredYears.next(this.years.slice());
      this.yearCtrl.setValue(this.years[this.years.length - 1]);
      this.selectedYear = this.years[this.years.length - 1];
      this.setInitialValue();

      this.refreshTable();
    });

    this.movies = this.cinemaService.getMovies();
    this.refreshTable();

    if (this.movies.length > 0) {
      this.moviesLoaded = true;
    }

    this.moviesSubscription = cinemaService.moviesChange.subscribe(value => {
      this.moviesLoaded = true;

      this.movies = value;
      this.refreshTable();
    });
  }

  ngOnInit() {
    this.settingsService.checkShowCinema();

    // this.dataSource.paginator = this.paginator;

    // set initial selection
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
    if (this.selectedYear == null) {
      this.dataSource = new MatTableDataSource(this.movies);
      this.dataSource.sort = this.sort;
    } else {
      const moviesToShow = [];

      if (this.selectedYear.id != null) {
        for (let i = 0; i < this.movies.length; i++) {
          if (this.movies[i].movieYearID === this.selectedYear.id) {
            moviesToShow.push(this.movies[i]);
          }
        }
        this.dataSource = new MatTableDataSource(moviesToShow);
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource(this.movies);
        this.dataSource.sort = this.sort;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  yearSelectChange(value) {
    this.selectedYear = value;

    const moviesToShow = [];

    for (let i = 0; i < this.movies.length; i++) {
      if (this.movies[i].movieYearID === this.selectedYear.id) {
        moviesToShow.push(this.movies[i]);
      }
    }

    this.dataSource = new MatTableDataSource(moviesToShow);
    this.dataSource.sort = this.sort;
    if (this.filterValue !== null) {
      this.applyFilter(this.filterValue);
    }
  }

  onCreate() {
    this.dialog.open(MovieCreateModalComponent, {
      width: '80vh'
    });
  }

  onEdit(movie: Movie) {
    this.dialog.open(MovieEditModalComponent, {
      width: '80vh',
      data: {movie}
    });
  }

  onBookings(movie: Movie) {
    this.dialog.open(MovieBookingsModalComponent, {
      width: '80vh',
      data: {movie}
    });
  }

  onInfo(movie: Movie) {
    this.dialog.open(MovieInfoModalComponent, {
      width: '80vh',
      data: {movie}
    });
  }

  deleteMovie(id: number) {
    this.bottomSheet.open(MovieDeleteModalComponent, {
      data: {movieID: id}
    });
  }

  refreshMovies() {
    this.moviesLoaded = false;
    this.movies = [];
    this.years = [];
    this.refreshTable();
    this.cinemaService.fetchYears();
    this.cinemaService.fetchMovies();
  }

  private setInitialValue() {
    this.filteredYears.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
      // setting the compareWith property to a comparison function
      // triggers initializing the selection according to the initial value of
      // the form control (i.e. _initializeSelection())
      // this needs to be done after the filteredYears are loaded initially
      // and after the mat-option elements are available
      this.yearSelect.compareWith = (a: Year, b: Year) => a && b && a.id === b.id;
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
    this.filteredYears.next(
      this.years.filter(
        year =>
          year.year
            .toString()
            .toLowerCase()
            .indexOf(search) > -1
      )
    );
  }
}
