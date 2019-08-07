import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {Decision} from '../../models/decision.model';
import {Event} from '../../models/event.model';

@Component({
  selector: 'app-events-vote-for-decision-modal',
  templateUrl: './events-vote-for-decision-modal.component.html',
  styleUrls: ['./events-vote-for-decision-modal.component.css']
})
export class EventsVoteForDecisionModalComponent {
  event: Event;
  name: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<EventsVoteForDecisionModalComponent>) {
    this.event = data.event;
    this.name = this.event.name;
  }

  voteFor(decision: Decision) {
    this.bottomSheetRef.dismiss(decision);
  }
}
