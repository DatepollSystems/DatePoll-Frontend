import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subject, Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import {CalendarDateFormatter, CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';

import {QuestionDialogComponent} from '../../utils/shared-components/question-dialog/question-dialog.component';
import {MovieEditModalComponent} from '../cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {MovieInfoModalComponent} from '../cinema/movie-administration/movie-info-modal/movie-info-modal.component';
import {EventInfoModalComponent} from '../events/event-info/event-info-modal/event-info-modal.component';
import {EventUpdateModalComponent} from '../events/events-administration/event-update-modal/event-update-modal.component';

import {Permissions} from '../../permissions';
import {TranslateService} from '../../translation/translate.service';
import {SettingsService} from '../../utils/settings.service';
import {CinemaUserService} from '../cinema/cinema-user.service';
import {EventsUserService} from '../events/events-user.service';
import {EventsService} from '../events/events.service';
import {MyUserService} from '../my-user.service';
import {UserSettingsService} from '../settings/privacy-settings/userSettings.service';
import {HomepageService} from '../start/homepage.service';
import {CinemaService} from '../cinema/cinema.service';

import {CustomDateFormatter} from './custom-date-formatter.provider';

import {Movie} from '../cinema/models/movie.model';
import {Event} from '../events/models/event.model';
import {HomeBirthdayModel} from '../start/birthdays.model';
import {UIHelper} from '../../utils/helper/UIHelper';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit, OnDestroy {
  locale = 'de';

  view: CalendarView = CalendarView.Month;
  mobileView: CalendarView = CalendarView.Day;

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

  public serverInfo = null;
  private serverInfoSubscription: Subscription;

  constructor(
    private settingsService: SettingsService,
    private cinemaService: CinemaService,
    private cinemaUserService: CinemaUserService,
    private eventsUserService: EventsUserService,
    private eventsService: EventsService,
    private myUserService: MyUserService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private userSettingsService: UserSettingsService,
    private homepageService: HomepageService,
    private bottomSheet: MatBottomSheet
  ) {
    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });

    this.showMovies = this.userSettingsService.getShowMoviesInCalendar();
    this.showMoviesSubscription = this.userSettingsService.showMoviesInCalendarChange.subscribe((value) => {
      this.showMovies = value;
      this.refreshCalendar();
    });

    this.showEvents = this.userSettingsService.getShowEventsInCalendar();
    this.showEventsSubscription = this.userSettingsService.showEventsInCalendarChange.subscribe((value) => {
      this.showEvents = value;
      this.refreshCalendar();
    });

    this.showBirthdays = this.userSettingsService.getShowBirthdaysInCalendar();
    this.showBirthdaysSubscription = this.userSettingsService.showBirthdaysInCalendarChange.subscribe((value) => {
      this.showBirthdays = value;
      this.refreshCalendar();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.serverInfo?.cinema_enabled) {
        this.movies = this.cinemaUserService.getNotShownMovies();

        this.moviesSubscription = this.cinemaUserService.notShownMoviesChange.subscribe((value) => {
          this.movies = value;
          this.refreshCalendar();
        });
      }

      if (this.serverInfo?.events_enabled) {
        if (this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
          this.avents = this.eventsService.getEvents();

          this.aventSubscription = this.eventsService.eventsChange.subscribe((value) => {
            this.avents = value;
            this.refreshCalendar();
          });
        } else {
          this.avents = this.eventsUserService.getEvents();

          this.aventSubscription = this.eventsUserService.eventsChange.subscribe((value) => {
            this.avents = value;
            this.refreshCalendar();
          });
        }
      }

      this.birthdays = this.homepageService.getBirthdays();
      this.birthdaysSubscription = this.homepageService.birthdaysChange.subscribe((value) => {
        this.birthdays = value;
        this.refreshCalendar();
      });
    }, 1000);
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
    this.serverInfoSubscription.unsubscribe();
    if (this.birthdaysSubscription) {
      this.birthdaysSubscription.unsubscribe();
    }
    this.showMoviesSubscription.unsubscribe();
    this.showEventsSubscription.unsubscribe();
    this.showBirthdaysSubscription.unsubscribe();
  }

  refreshCalendar() {
    this.activeDayIsOpen = false;
    this.events = [];

    if (this.showMovies && this.movies) {
      for (const movie of this.movies) {
        if (this.myUserService.hasPermission(Permissions.CINEMA_MOVIE_ADMINISTRATION)) {
          movie.actions = [
            {
              label: '[&#9997;] ',
              onClick: (): void => {
                this.dialog.open(MovieEditModalComponent, {
                  width: '80%',
                  data: {movie: movie.id},
                });
              },
            },
            {
              label: '[&#10060;]',
              onClick: (): void => {
                const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
                  data: {
                    question: 'CINEMA_TICKETS_ADMINISTRATION_MOVIE_DELETE_MODAL_TITLE',
                  },
                });

                bottomSheetRef.afterDismissed().subscribe((value: string) => {
                  if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
                    this.cinemaService.deleteMovie(movie.id).subscribe(
                      (data: any) => {
                        console.log(data);
                        this.cinemaService.fetchMovies();
                        this.snackBar.open(
                          this.translate.getTranslationFor('CINEMA_TICKETS_ADMINISTRATION_MOVIE_DELETE_MODAL_SUCCESSFULLY_DELETED')
                        );
                      },
                      (error) => console.log(error)
                    );
                  }
                });
              },
            },
          ];
        }
        this.events.push(movie);
      }
    }

    if (this.showEvents && this.avents) {
      for (const avent of this.avents) {
        if (this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
          avent.actions = [
            {
              label: '[&#9997;] ',
              onClick: (): void => {
                this.dialog.open(EventUpdateModalComponent, {
                  width: '80%',
                  data: {
                    event: avent,
                  },
                });
              },
            },
            {
              label: '[&#10060;]',
              onClick: (): void => {
                const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
                  data: {
                    question: 'EVENTS_ADMINISTRATION_DELETE_EVENT_QUESTION',
                  },
                });

                bottomSheetRef.afterDismissed().subscribe((value: string) => {
                  if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
                    this.eventsService.deleteEvent(avent.id).subscribe(
                      (response: any) => {
                        console.log(response);
                        this.eventsService.fetchEvents();
                        this.snackBar.open(this.translate.getTranslationFor('EVENTS_ADMINISTRATION_DELETE_EVENT_SUCCESSFULLY_DELETED'));
                      },
                      (error) => console.log(error)
                    );
                  }
                });
              },
            },
          ];
        }
        this.events.push(avent);
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
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0);
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
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

  handleEvent(object: CalendarEvent) {
    if (object instanceof Movie) {
      if (this.myUserService.hasPermission(Permissions.CINEMA_MOVIE_ADMINISTRATION)) {
        this.dialog.open(MovieInfoModalComponent, {
          width: '80%',
          data: {movie: object},
        });
      }
    } else if (object instanceof Event) {
      this.dialog.open(EventInfoModalComponent, {
        width: '80%',
        data: {
          event: object,
        },
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

  isEvent(ev: CalendarEvent) {
    return ev instanceof Event;
  }

  isMovie(ev: CalendarEvent) {
    return ev instanceof Movie;
  }

  isBirthday(ev: CalendarEvent) {
    return ev instanceof HomeBirthdayModel;
  }
}
