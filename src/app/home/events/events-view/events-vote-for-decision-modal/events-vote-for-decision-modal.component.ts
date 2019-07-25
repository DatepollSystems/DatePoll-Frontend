import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {EventsUserService} from '../../events-user.service';
import {HomepageService} from '../../../start/homepage.service';
import {Decision} from '../../models/decision.model';
import {Event} from '../../models/event.model';

@Component({
  selector: 'app-events-vote-for-decision-modal',
  templateUrl: './events-vote-for-decision-modal.component.html',
  styleUrls: ['./events-vote-for-decision-modal.component.css']
})
export class EventsVoteForDecisionModalComponent {
  @ViewChild('successfullyVoted', {static: true}) successfullyVoted: TemplateRef<any>;

  event: Event;
  name: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<EventsVoteForDecisionModalComponent>,
              private notificationsService: NotificationsService,
              private eventsUserService: EventsUserService,
              private homepageService: HomepageService) {
    this.event = data.event;
    this.name = this.event.name;
  }

  voteFor(decision: Decision) {
    this.eventsUserService.voteForDecision(this.event.id, decision).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsUserService.fetchEvents();
        this.homepageService.fetchData();
        this.notificationsService.html(this.successfullyVoted, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    this.bottomSheetRef.dismiss();
  }

}
