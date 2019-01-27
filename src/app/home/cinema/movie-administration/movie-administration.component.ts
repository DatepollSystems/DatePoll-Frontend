import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CinemaService} from '../cinema.service';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MatDialog, MatSelect, MatTableDataSource} from '@angular/material';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {Movie} from '../movie';
import {Year} from '../year';
import {FormControl} from '@angular/forms';
import {take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.css']
})
export class MovieAdministrationComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'date', 'trailer', 'poster', 'worker', 'emergencyWorker', 'bookedTickets'];
  filterValue: string = null;

  /** control for the selected years */
  public yearCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public yearFilterCtrl: FormControl = new FormControl();

  /** list of years filtered by search keyword */
  public filteredYears: ReplaySubject<Year[]> = new ReplaySubject<Year[]>(1);

  @ViewChild('yearSelect') yearSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  private moviesSubscription: Subscription;
  private movies: Movie[];
  dataSource: MatTableDataSource<Movie>;

  private yearsSubscription: Subscription;
  private years: Year[];

  private selectedYear: Year = null;

  constructor(private cinemaService: CinemaService, private dialog: MatDialog) {
    this.years = this.cinemaService.getYears();
    this.selectedYear = this.years[this.years.length - 1];
    this.yearsSubscription = cinemaService.yearsChange.subscribe((value) => {
      this.years = value;
      this.filteredYears.next(this.years.slice());
      this.setInitialValue();
      this.yearCtrl.setValue(this.years[this.years.length - 1]);
      this.selectedYear = this.years[this.years.length - 1];
    });

    this.movies = this.cinemaService.getMovies();
    if (this.selectedYear === null) {
      this.dataSource = new MatTableDataSource(this.movies);
    } else {
      const moviesToShow = [];

      for (let i = 0; i < this.movies.length; i++) {
        if (this.movies[i].getMovieYearID() === this.selectedYear.getID()) {
          moviesToShow.push(this.movies[i]);
        }
      }

      this.dataSource = new MatTableDataSource(moviesToShow);
    }

    this.moviesSubscription = cinemaService.moviesChange.subscribe((value) => {
      this.movies = value;

      if (this.selectedYear === null) {
        this.dataSource = new MatTableDataSource(this.movies);
      } else {
        const moviesToShow = [];

        for (let i = 0; i < this.movies.length; i++) {
          if (this.movies[i].getMovieYearID() === this.selectedYear.getID()) {
            moviesToShow.push(this.movies[i]);
          }
        }

        this.dataSource = new MatTableDataSource(moviesToShow);
      }
    });
  }

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;

    // set initial selection
    this.yearCtrl.setValue(this.years[1]);

    // load the initial bank list
    this.filteredYears.next(this.years.slice());

    // listen for search field value changes
    this.yearFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterYears();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  private setInitialValue() {
    this.filteredYears
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredYears are loaded initially
        // and after the mat-option elements are available
        this.yearSelect.compareWith = (a: Year, b: Year) => a && b && a.getID() === b.getID();
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
      this.years.filter(bank => bank.getYear().toString().toLowerCase().indexOf(search) > -1)
    );
  }

  yearSelectChange(value) {
    this.selectedYear = value;

    const moviesToShow = [];

    for (let i = 0; i < this.movies.length; i++) {
      if (this.movies[i].getMovieYearID() === this.selectedYear.getID()) {
        moviesToShow.push(this.movies[i]);
      }
    }

    this.dataSource = new MatTableDataSource(moviesToShow);
    if (this.filterValue !== null) {
      this.applyFilter(this.filterValue);
    }
  }

  onEdit(id: number) {
    this.dialog.open(MovieEditModalComponent, {
      width: '80vh',
      data: {movie: this.cinemaService.getMovieByID(id)}
    });
  }
}
