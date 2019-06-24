import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject, Subscription} from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {CinemaService} from '../cinema/cinema.service';
import {Movie} from '../cinema/models/movie.model';
import {MyUserService} from '../my-user.service';
import {Permissions} from '../../permissions';
import {MovieEditModalComponent} from '../cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {SettingsService} from '../../services/settings.service';
import {MovieInfoModalComponent} from '../cinema/movie-administration/movie-info-modal/movie-info-modal.component';
import {Event} from '../events/models/event.model';
import {EventsUserService} from '../events/events-user.service';
import {EventUpdateModalComponent} from '../events/events-administration/event-update-modal/event-update-modal.component';
import {EventDeleteModalComponent} from '../events/events-administration/event-delete-modal/event-delete-modal.component';
import {MatBottomSheet} from '@angular/material';
import {EventInfoModalComponent} from '../events/event-info-modal/event-info-modal.component';
import {EventsService} from '../events/events.service';
import {MovieDeleteModalComponent} from '../cinema/movie-administration/movie-delete-modal/movie-delete-modal.component';

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

  private avents: Event[];
  private aventSubscription: Subscription;

  constructor(
    private settingsService: SettingsService,
    private cinemaService: CinemaService,
    private eventsUserService: EventsUserService,
    private eventsService: EventsService,
    private myUserService: MyUserService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet) {
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

    if (this.settingsService.getShowEvents()) {
      if (this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
        this.avents = this.eventsService.getEvents();
        this.refreshCalendar();

        this.aventSubscription = this.eventsService.eventsChange.subscribe((value) => {
          this.avents = value;
          this.refreshCalendar();
        });
      } else {
        this.avents = this.eventsUserService.getEvents();
        this.refreshCalendar();

        this.aventSubscription = this.eventsUserService.eventsChange.subscribe((value) => {
          this.avents = value;
          this.refreshCalendar();
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.moviesSubscription != null) {
      this.moviesSubscription.unsubscribe();
    }
    if (this.aventSubscription != null) {
      this.aventSubscription.unsubscribe();
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
                this.bottomSheet.open(MovieDeleteModalComponent, {
                  'data': {'movieID': this.movies[i].id}
                });
              }
            }
          ];
        }
        this.events.push(this.movies[i]);
      }
    }

    if (this.avents != null) {
      for (let i = 0; i < this.avents.length; i++) {
        if (this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
          this.avents[i].actions = [
            {
              label: '[&#9997;] ',
              onClick: ({event}: { event: CalendarEvent }): void => {
                this.dialog.open(EventUpdateModalComponent, {
                  width: '80vh',
                  'data': {
                    'event': this.avents[i]
                  }
                });
              }
            },
            {
              label: '[&#10060;]',
              onClick: ({event}: { event: CalendarEvent }): void => {
                this.bottomSheet.open(EventDeleteModalComponent, {
                  'data': {'eventID': this.avents[i].id}
                });
              }
            }
          ];
        }
        this.events.push(this.avents[i]);
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

  handleEvent(object: any) {
    if (object instanceof Movie) {
      if (this.myUserService.hasPermission(Permissions.CINEMA_MOVIE_ADMINISTRATION)) {
        this.dialog.open(MovieInfoModalComponent, {
          width: '80vh',
          data: {movie: object}
        });
      }
    } else if (object instanceof Event) {
      this.dialog.open(EventInfoModalComponent, {
        width: '80vh',
        'data': {
          'event': object
        }
      });
    }
  }
}
