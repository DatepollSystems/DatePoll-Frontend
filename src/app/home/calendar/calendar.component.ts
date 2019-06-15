import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject, Subscription} from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {CinemaService} from '../cinema/cinema.service';
import {Movie} from '../cinema/movie.model';
import {MyUserService} from '../my-user.service';
import {Permissions} from '../../permissions';
import {MovieEditModalComponent} from '../cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {SettingsService} from '../../services/settings.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, OnDestroy {
  locale = 'de';

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  /*events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];*/

  activeDayIsOpen = false;

  private movies: Movie[];
  private moviesSubscription: Subscription;

  constructor(
    private settingsService: SettingsService,
    private cinemaService: CinemaService,
    private myUserService: MyUserService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.settingsService.getShowCinema()) {
      this.movies = this.cinemaService.getNotShownMovies();
      this.refreshCalendar();

      this.moviesSubscription = this.cinemaService.notShownMoviesChange.subscribe((value) => {
        this.movies = value;
        this.refreshCalendar();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.moviesSubscription != null) {
      this.moviesSubscription.unsubscribe();
    }
  }

  refreshCalendar() {
    this.activeDayIsOpen = false;
    this.events = [];

    if (this.movies != null) {
      for (let i = 0; i < this.movies.length; i++) {
        if (this.myUserService.hasPermission(Permissions.CINEMA_MOVIE_ADMINISTRATION)) {
          this.movies[i].actions = [
            {
              label: '[&#9997;] ',
              onClick: ({event}: { event: CalendarEvent }): void => {
                this.dialog.open(MovieEditModalComponent, {
                  width: '80vh',
                  data: {movie: this.movies[i]}
                });
              }
            },
            {
              label: '[&#10060;]',
              onClick: ({event}: { event: CalendarEvent }): void => {
                this.cinemaService.deleteMovie(this.movies[i].id).subscribe(
                  (data: any) => {
                    console.log(data);
                    this.cinemaService.fetchMovies();
                    this.cinemaService.fetchNotShownMovies();
                  },
                  (error) => console.log(error)
                );
              }
            }
          ];
        }
        this.events.push(this.movies[i]);
      }
    }

    this.cdr.detectChanges();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(test: any, test1: any) {

  }
}
