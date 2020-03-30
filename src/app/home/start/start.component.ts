import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../translation/translate.service';
import {EventsUserService} from '../events/events-user.service';
import {MyUserService} from '../my-user.service';
import {HomepageService} from './homepage.service';

import {Event} from '../events/models/event.model';
import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';

import {IsMobileService} from '../../utils/is-mobile.service';
import {EventInfoModalComponent} from '../events/event-info/event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from '../events/events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {QuestionDialogComponent} from '../../utils/shared-components/question-dialog/question-dialog.component';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {
  birthdays: HomeBirthdayModel[];
  birthdaysSubscription: Subscription;

  bookings: HomeBookingsModel[];
  bookingsSubscription: Subscription;

  events: Event[];
  eventsSubscription: Subscription;

  isMobile = true;
  isMobileSubscription: Subscription;

  eventVotingChangeLoading = false;

  constructor(
    private homePageService: HomepageService,
    public myUserService: MyUserService,
    private eventsUserSerivce: EventsUserService,
    private bottomSheet: MatBottomSheet,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private isMobileService: IsMobileService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.birthdays = homePageService.getBirthdays();
    this.birthdaysSubscription = homePageService.birthdaysChange.subscribe(value => {
      this.birthdays = value;
      this.setBackgroundImage();
    });

    this.bookings = homePageService.getBookings();
    this.bookingsSubscription = homePageService.bookingsChange.subscribe(value => {
      this.bookings = value;
      this.setBackgroundImage();
    });

    this.events = homePageService.getEvents().slice(0, 10);
    this.eventsSubscription = homePageService.eventsChange.subscribe(value => {
      this.events = value.slice(0, 10);
      this.setBackgroundImage();
      this.eventVotingChangeLoading = false;
    });

    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe(value => {
      this.isMobile = value;
    });
  }

  ngOnInit() {
    this.setBackgroundImage();
  }

  setBackgroundImage() {
    if (this.birthdays.length === 0 && this.bookings.length === 0 && this.events.length === 0) {
      const currentDate = new Date();

      if (currentDate.getHours() >= 19 || currentDate.getHours() <= 7) {
        document.getElementById('my-container').style.backgroundImage = 'url(/assets/startpage-background-night.jpg)';
      } else {
        document.getElementById('my-container').style.backgroundImage = 'url(/assets/startpage-background-day.jpg)';
      }

      document.getElementById('my-container').style.backgroundSize = 'cover';
    } else {
      document.getElementById('my-container').style.background = 'none';
    }
  }

  ngOnDestroy() {
    this.bookingsSubscription.unsubscribe();
    this.birthdaysSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
    this.isMobileSubscription.unsubscribe();

    document.getElementById('my-container').style.background = 'none';
  }

  onEventItemClick(event: Event) {
    if (event.alreadyVotedFor) {
      this.cancelEventVoting(event, null);
    } else {
      this.onEventVote(event);
    }
  }

  onEventInfo(event: Event) {
    if (this.isMobile) {
      this.router.navigate(['/home/events/' + event.id]);
    } else {
      this.dialog.open(EventInfoModalComponent, {
        width: '80vh',
        data: {
          event
        }
      });
    }
  }

  onEventVote(event: Event) {
    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {event}
    });

    bottomSheetRef.afterDismissed().subscribe(dto => {
      if (dto != null) {
        this.eventsUserSerivce.voteForDecision(event.id, dto.decision, dto.additionalInformation).subscribe(
          (response: any) => {
            console.log(response);
            this.eventsUserSerivce.fetchEvents();
            this.homePageService.fetchData();
            this.notificationsService.success(
              this.translate.getTranslationFor('SUCCESSFULLY'),
              this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_VOTED')
            );
          },
          error => console.log(error)
        );
      } else {
        console.log('events-view | Closed bottom sheet, voted for nohting');
      }
    });
  }

  cancelEventVoting(event, button: any) {
    const answers = [
      {
        answer: this.translate.getTranslationFor('YES'),
        value: 'yes'
      },
      {
        answer: this.translate.getTranslationFor('NO'),
        value: 'no'
      }
    ];
    const question = this.translate.getTranslationFor('EVENTS_CANCEL_VOTING');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          if (this.eventVotingChangeLoading && this.isMobile) {
            return;
          }
          this.eventVotingChangeLoading = true;
          if (button) {
            button.disabled = true;
          }
          this.eventsUserSerivce.removeDecision(event.id).subscribe(
            (response: any) => {
              console.log(response);
              this.homePageService.fetchData();
              this.setBackgroundImage();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_REMOVED_VOTING')
              );
            },
            error => {
              console.log(error);
              this.eventVotingChangeLoading = false;
            }
          );
        }
      }
    });
  }
}
