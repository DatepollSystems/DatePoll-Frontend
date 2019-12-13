import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet, MatDialog, MatSlideToggleChange} from '@angular/material';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {EventsUserService} from '../events-user.service';
import {HomepageService} from '../../start/homepage.service';
import {TranslateService} from '../../../translation/translate.service';

import {EventInfoModalComponent} from '../event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from './events-vote-for-decision-modal/events-vote-for-decision-modal.component';

import {Event} from '../models/event.model';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnDestroy {
  @ViewChild('successfullyRemovedDecision', {static: true}) successfullyRemovedDecision: TemplateRef<any>;
  loading = true;
  showAllEvents = false;

  eventsToShow: Event[];
  events: Event[];
  eventsSubscription: Subscription;

  constructor(
    private eventsUserSerivce: EventsUserService,
    private homepageService: HomepageService,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog) {

    this.events = this.eventsUserSerivce.getEvents();
    this.refreshView();
    if (this.events.length > 0) {
      this.loading = false;
    }
    this.eventsSubscription = this.eventsUserSerivce.eventsChange.subscribe((value) => {
      this.events = value;
      this.loading = false;
      this.refreshView();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  refreshView() {
    if (this.showAllEvents) {
      this.eventsToShow = this.events.slice();
    } else {
      this.eventsToShow = [];
      for (let i = 0; i < this.events.length; i++) {
        if (!this.events[i].alreadyVotedFor) {
          this.eventsToShow.push(this.events.slice()[i]);
        }
      }
    }
  }

  onShowAllEventsChange(event: MatSlideToggleChange) {
    this.refreshView();
  }

  onInfo(event: Event) {
    this.dialog.open(EventInfoModalComponent, {
      width: '80vh',
      'data': {
        'event': event
      }
    });
  }

  onVote(event: Event) {
    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {'event': event},
    });
    bottomSheetRef.afterDismissed().subscribe((dto) => {
      if (dto.decision != null) {
        const decision = dto.decision;

        this.eventsUserSerivce.voteForDecision(event.id, decision, dto.additionalInformation).subscribe(
          (response: any) => {
            console.log(response);
            this.eventsUserSerivce.fetchEvents();
            this.homepageService.fetchData();
            this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
              this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_VOTED'));
          },
          (error) => console.log(error)
        );
      } else {
        console.log('events-view | Closed bottom sheet, voted for nohting');
      }
    });
  }

  cancelVoting(event: Event, button: any) {
    button.disabled = true;
    this.eventsUserSerivce.removeDecision(event.id).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsUserSerivce.fetchEvents();
        this.refreshView();
        this.notificationsService.html(this.successfullyRemovedDecision, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }
}
