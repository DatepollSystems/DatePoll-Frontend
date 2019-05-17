import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';

import {PerformanceBadgesService} from '../performance-badges.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';
import {Instrument} from '../instrument.model';

@Component({
  selector: 'app-instrument-update-modal',
  templateUrl: './instrument-update-modal.component.html',
  styleUrls: ['./instrument-update-modal.component.css']
})
export class InstrumentUpdateModalComponent {

  @ViewChild('successfullyUpdatedInstrument') successfullyUpdatedInstrument: TemplateRef<any>;

  instrument: Instrument;
  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private performanceBadgesService: PerformanceBadgesService,
              private notifationsService: NotificationsService,
              private dialogRef: MatDialogRef<InstrumentUpdateModalComponent>) {

    this.instrument = data.instrument;
    this.name = data.instrument.name;
  }

  update(form: NgForm) {
    const name = form.controls.instrumentName.value;

    this.performanceBadgesService.updateInstrument(this.instrument.id, name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchInstruments();
        this.notifationsService.html(this.successfullyUpdatedInstrument, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    this.dialogRef.close();
  }

}
