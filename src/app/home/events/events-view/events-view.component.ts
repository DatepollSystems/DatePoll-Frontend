import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet, MatDialog, MatSlideToggleChange} from '@angular/material';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {EventInfoModalComponent} from '../event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from './events-vote-for-decision-modal/events-vote-for-decision-modal.component';

import {Event} from '../models/event.model';
import {EventsUserService} from '../events-user.service';

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
    this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: { 'event': event },
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
