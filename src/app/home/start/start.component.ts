import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../translation/translate.service';
import {EventsUserService} from '../events/events-user.service';
import {MyUserService} from '../my-user.service';
import {HomepageService} from './homepage.service';

import {Broadcast} from '../broadcasts/models/broadcast.model';
import {Event} from '../events/models/event.model';
import {HomeBirthdayModel} from './birthdays.model';
import {HomeBookingsModel} from './bookings.model';

import {SettingsService} from '../../utils/settings.service';
import {QuestionDialogComponent} from '../../utils/shared-components/question-dialog/question-dialog.component';
import {EventsVoteForDecisionModalComponent} from '../events/events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {Converter} from '../../utils/helper/Converter';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnDestroy {
  birthdays: HomeBirthdayModel[];
  birthdaysSubscription: Subscription;
  showBirthdays = false;

  bookings: HomeBookingsModel[];
  bookingsSubscription: Subscription;

  events: Event[];
  eventsSubscription: Subscription;

  broadcasts: Broadcast[];
  broadcastSubscription: Subscription;

  eventVotingChangeLoading = false;

  openEventsCount = 0;
  loaded = false;

  alert: any;
  happyAlertSubscription: Subscription;
  showFirework = false;

  constructor(
    private homePageService: HomepageService,
    public myUserService: MyUserService,
    private eventsUserSerivce: EventsUserService,
    private bottomSheet: MatBottomSheet,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.birthdays = homePageService.getBirthdays();
    this.birthdaysSubscription = homePageService.birthdaysChange.subscribe((value) => {
      this.birthdays = value;
    });

    this.bookings = homePageService.getBookings();
    this.bookingsSubscription = homePageService.bookingsChange.subscribe((value) => {
      this.bookings = value;
      this.loaded = true;
    });

    this.events = homePageService.getEvents().slice(0, 5);
    this.countOpenEvents();
    this.eventsSubscription = homePageService.eventsChange.subscribe((value) => {
      this.events = value.slice(0, 5);
      this.countOpenEvents();
      this.eventVotingChangeLoading = false;
      this.loaded = true;
    });

    this.broadcasts = homePageService.getBroadcasts();
    this.broadcastSubscription = homePageService.broadcastChange.subscribe((value) => {
      this.broadcasts = value;
      this.loaded = true;
    });

    this.alert = this.settingsService.getAlert();
    this.checkIfFireworkShouldBeShown();
    this.happyAlertSubscription = this.settingsService.alertChange.subscribe((value) => {
      this.alert = value;
      this.checkIfFireworkShouldBeShown();
    });
  }

  ngOnDestroy() {
    this.bookingsSubscription.unsubscribe();
    this.birthdaysSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
    this.broadcastSubscription.unsubscribe();
  }

  onBroadcastItemClick(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/' + broadcast.id, {state: broadcast});
  }

  onEventItemClick(event: Event) {
    if (event.alreadyVotedFor) {
      this.cancelEventVoting(event, null);
    } else {
      this.onEventVote(event);
    }
  }

  onEventInfo(event: Event) {
    this.router.navigateByUrl('/home/events/' + event.id, {state: event});
  }

  private onEventVote(event: Event) {
    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {event},
    });

    bottomSheetRef.afterDismissed().subscribe((dto) => {
      if (dto != null) {
        this.eventsUserSerivce.voteForDecision(event.id, dto.decision, dto.additionalInformation).subscribe(
          (response: any) => {
            console.log(response);
            this.homePageService.fetchData(true);
            this.notificationsService.success(
              this.translate.getTranslationFor('SUCCESSFULLY'),
              this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_VOTED')
            );
          },
          (error) => console.log(error)
        );
      } else {
        console.log('events-view | Closed bottom sheet, voted for nohting');
      }
    });
  }

  private cancelEventVoting(event, button: any) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'EVENTS_CANCEL_VOTING',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        if (this.eventVotingChangeLoading) {
          return;
        }
        this.eventVotingChangeLoading = true;
        if (button) {
          button.disabled = true;
        }
        this.eventsUserSerivce.removeDecision(event.id).subscribe(
          (response: any) => {
            console.log(response);
            this.homePageService.fetchData(true);
            this.notificationsService.success(
              this.translate.getTranslationFor('SUCCESSFULLY'),
              this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_REMOVED_VOTING')
            );
          },
          (error) => {
            console.log(error);
            this.eventVotingChangeLoading = false;
          }
        );
      }
    });
  }

  private countOpenEvents() {
    this.openEventsCount = 0;
    for (const event of this.events) {
      if (!event.alreadyVotedFor) {
        this.openEventsCount++;
      }
    }
  }

  private checkIfFireworkShouldBeShown() {
    if (this.alert?.message?.trim().toLowerCase().length > 0 && this.alert?.type?.includes('happy')) {
      if (localStorage.getItem('firework') == null) {
        localStorage.setItem('firework', Converter.booleanToString(true));
      }
      this.showFirework = Converter.stringToBoolean(localStorage.getItem('firework'));
    }
  }

  toggleFirework() {
    this.showFirework = !this.showFirework;
    localStorage.setItem('firework', Converter.booleanToString(this.showFirework));
  }
}
