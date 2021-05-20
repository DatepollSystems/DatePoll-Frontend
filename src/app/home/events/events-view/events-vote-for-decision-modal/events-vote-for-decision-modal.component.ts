import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

import {EventDecision} from '../../models/event-decision.model';
import {Event} from '../../models/event.model';
import {EventsVoteForDecisionAdditionalInformationModalComponent} from './events-vote-for-decision-additional-information-modal/events-vote-for-decision-additional-information-modal.component';

@Component({
  selector: 'app-events-vote-for-decision-modal',
  templateUrl: './events-vote-for-decision-modal.component.html',
  styleUrls: ['./events-vote-for-decision-modal.component.css'],
})
export class EventsVoteForDecisionModalComponent {
  event: Event;
  name: string;

  additionalInformation = null;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<EventsVoteForDecisionModalComponent>,
    private dialog: MatDialog,
    private changeRef: ChangeDetectorRef
  ) {
    this.event = data.event;
    this.name = this.event.name;
  }

  voteFor(decision: EventDecision) {
    const dto = {
      decision,
      additionalInformation: this.additionalInformation,
    };

    this.bottomSheetRef.dismiss(dto);
  }

  addAdditionalInformation() {
    const bottomSheetRef = this.dialog.open(EventsVoteForDecisionAdditionalInformationModalComponent, {
      width: '80vh',
      data: {additionalInformation: this.additionalInformation},
    });

    bottomSheetRef.afterClosed().subscribe((additionalInformation) => {
      this.additionalInformation = additionalInformation;
      console.log('Add additional information: ' + this.additionalInformation);
      this.changeRef.markForCheck();
    });
  }
}
