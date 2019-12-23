import {Component, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-events-vote-for-decision-additional-information-modal',
  templateUrl: './events-vote-for-decision-additional-information-modal.component.html',
  styleUrls: ['./events-vote-for-decision-additional-information-modal.component.css']
})
export class EventsVoteForDecisionAdditionalInformationModalComponent {

  additionalInformation = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EventsVoteForDecisionAdditionalInformationModalComponent>) {
    this.additionalInformation = data.additionalInformation;
  }

  addAdditionalInformation(form: NgForm) {
    const additionalInformation = form.controls.additionalInformation.value;

    this.dialogRef.close(additionalInformation);
  }

}
