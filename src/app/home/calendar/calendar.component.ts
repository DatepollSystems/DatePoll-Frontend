import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subject, Subscription} from 'rxjs';

import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';

import {MovieDeleteModalComponent} from '../cinema/movie-administration/movie-delete-modal/movie-delete-modal.component';
import {MovieEditModalComponent} from '../cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from '../cinema/movie-administration/movie-info-modal/movie-info-modal.component';
import {EventInfoModalComponent} from '../events/event-info/event-info-modal/event-info-modal.component';
import {EventUpdateModalComponent} from '../events/events-administration/event-update-modal/event-update-modal.component';

import {Permissions} from '../../permissions';
import {SettingsService} from '../../utils/settings.service';
import {CinemaService} from '../cinema/cinema.service';
import {EventsUserService} from '../events/events-user.service';
import {EventsService} from '../events/events.service';
import {MyUserService} from '../my-user.service';
import {UserSettingsService} from '../settings/privacy-settings/userSettings.service';
import {HomepageService} from '../start/homepage.service';

import {Movie} from '../cinema/models/movie.model';
import {Event} from '../events/models/event.model';
import {HomeBirthdayModel} from '../start/birthdays.model';

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

  activeDayIsOpen = false;

  showMovies = false;
  showMoviesSubscription: Subscription;
  showEvents = false;
  showEventsSubscription: Subscription;
  showBirthdays = false;
  showBirthdaysSubscription: Subscription;

  private movies: Movie[];
  private moviesSubscription: Subscription;

  private avents: Event[];
  private aventSubscription: Subscription;

  private birthdays: HomeBirthdayModel[];
  private birthdaysSubscription: Subscription;

  public settingsService: SettingsService;

  constructor(
    settingsService: SettingsService,
    private cinemaService: CinemaService,
    private eventsUserService: EventsUserService,
    private eventsService: EventsService,
    private myUserService: MyUserService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private userSettingsService: UserSettingsService,
    private homepageService: HomepageService,
    private bottomSheet: MatBottomSheet
  ) {
    this.settingsService = settingsService;

    this.showMovies = this.userSettingsService.getShowMoviesInCalendar();
    this.showMoviesSubscription = this.userSettingsService.showMoviesInCalendarChange.subscribe(value => {
      this.showMovies = value;
      this.refreshCalendar();
    });

    this.showEvents = this.userSettingsService.getShowEventsInCalendar();
    this.showEventsSubscription = this.userSettingsService.showEventsInCalendarChange.subscribe(value => {
      this.showEvents = value;
      this.refreshCalendar();
    });

    this.showBirthdays = this.userSettingsService.getShowBirthdaysInCalendar();
    this.showBirthdaysSubscription = this.userSettingsService.showBirthdayChange.subscribe(value => {
      this.showBirthdays = value;
      this.refreshCalendar();
    });
  }

  ngOnInit() {
    if (this.settingsService.getShowCinema()) {
      this.movies = this.cinemaService.getNotShownMovies();

      this.moviesSubscription = this.cinemaService.notShownMoviesChange.subscribe(value => {
        this.movies = value;
        this.refreshCalendar();
      });
    }

    if (this.settingsService.getShowEvents()) {
      if (this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
        this.avents = this.eventsService.getEvents();

        this.aventSubscription = this.eventsService.eventsChange.subscribe(value => {
          this.avents = value;
          this.refreshCalendar();
        });
      } else {
        this.avents = this.eventsUserService.getEvents();

        this.aventSubscription = this.eventsUserService.eventsChange.subscribe(value => {
          this.avents = value;
          this.refreshCalendar();
        });
      }
    }

    this.birthdays = this.homepageService.getBirthdays();
    this.birthdaysSubscription = this.homepageService.birthdaysChange.subscribe(value => {
      this.birthdays = value;
      this.refreshCalendar();
    });
  }

  refreshEntries() {
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this.moviesSubscription != null) {
      this.moviesSubscription.unsubscribe();
    }
    if (this.aventSubscription != null) {
      this.aventSubscription.unsubscribe();
    }
    this.birthdaysSubscription.unsubscribe();
    this.showMoviesSubscription.unsubscribe();
    this.showEventsSubscription.unsubscribe();
    this.showBirthdaysSubscription.unsubscribe();
  }

  refreshCalendar() {
    this.activeDayIsOpen = false;
    this.events = [];

    if (this.showMovies) {
      if (this.movies != null) {
        for (let i = 0; i < this.movies.length; i++) {
          if (this.myUserService.hasPermission(Permissions.CINEMA_MOVIE_ADMINISTRATION)) {
            this.movies[i].actions = [
              {
                label: '[&#9997;] ',
                onClick: ({event}: {event: CalendarEvent}): void => {
                  this.dialog.open(MovieEditModalComponent, {
                    width: '80vh',
                    data: {movie: this.movies[i]}
                  });
                }
              },
              {
                label: '[&#10060;]',
                onClick: ({event}: {event: CalendarEvent}): void => {
                  this.bottomSheet.open(MovieDeleteModalComponent, {
                    data: {movieID: this.movies[i].id}
                  });
                }
              }
            ];
          }
          this.events.push(this.movies[i]);
        }
      }
    }

    if (this.showEvents) {
      if (this.avents != null) {
        for (let i = 0; i < this.avents.length; i++) {
          if (this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
            this.avents[i].actions = [
              {
                label: '[&#9997;] ',
                onClick: ({event}: {event: CalendarEvent}): void => {
                  this.dialog.open(EventUpdateModalComponent, {
                    width: '80vh',
                    data: {
                      event: this.avents[i]
                    }
                  });
                }
              },
              {
                label: '[&#10060;]',
                onClick: ({event}: {event: CalendarEvent}): void => {
                  // TODO: Calendar event delete click
                }
              }
            ];
          }
          this.events.push(this.avents[i]);
        }
      }
    }

    if (this.showBirthdays) {
      if (this.birthdays != null) {
        for (const birthday of this.birthdays) {
          this.events.push(birthday);
        }
      }
    }

    setTimeout(() => {
      if (this.cdr && !(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  dayClicked({date, events}: {date: Date; events: CalendarEvent[]}): void {
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
        data: {
          event: object
        }
      });
    }
  }

  onShowMoviesChange(ob: MatSlideToggleChange) {
    this.userSettingsService.setShowMoviesInCalendar(ob.checked, true);
  }

  onShowEventsChange(ob: MatSlideToggleChange) {
    this.userSettingsService.setShowEventsInCalendar(ob.checked, true);
  }

  onShowBirthdaysChange(ob: MatSlideToggleChange) {
    this.userSettingsService.setShowBirthdaysInCalendar(ob.checked, true);
    this.refreshCalendar();
  }
}
