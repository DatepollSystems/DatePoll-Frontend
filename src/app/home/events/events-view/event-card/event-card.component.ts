import {Component, Input} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {HomepageService} from '../../../start/homepage.service';
import {EventsUserService} from '../../events-user.service';

import {Event} from '../../models/event.model';

import {EventInfoModalComponent} from '../../event-info-modal/event-info-modal.component';
import {EventsVoteForDecisionModalComponent} from '../events-vote-for-decision-modal/events-vote-for-decision-modal.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input()
  public event: Event;

  public voting = false;
  public cancellingVoting = false;

  constructor(
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private eventsUserSerivce: EventsUserService,
    private homepageService: HomepageService
  ) {}

  onInfo(event: Event) {
    this.dialog.open(EventInfoModalComponent, {
      width: '80vh',
      data: {
        event
      }
    });
  }

  onVote() {
    const event = this.event;
    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {event}
    });
    bottomSheetRef.afterDismissed().subscribe(dto => {
      if (dto != null) {
        this.voting = true;

        const decision = dto.decision;

        this.eventsUserSerivce.voteForDecision(this.event.id, decision, dto.additionalInformation).subscribe(
          (response: any) => {
            console.log(response);
            this.eventsUserSerivce.fetchEvents();
            this.homepageService.fetchData();
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

  cancelVoting() {
    this.cancellingVoting = true;
    this.eventsUserSerivce.removeDecision(this.event.id).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsUserSerivce.fetchEvents();
        this.homepageService.fetchData();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_REMOVED_VOTING')
        );
      },
      error => console.log(error)
    );
  }
}