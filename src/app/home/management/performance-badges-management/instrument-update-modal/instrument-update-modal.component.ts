import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

import {PerformanceBadgesService} from '../performance-badges.service';
import {Instrument} from '../models/instrument.model';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-instrument-update-modal',
  templateUrl: './instrument-update-modal.component.html',
  styleUrls: ['./instrument-update-modal.component.css'],
})
export class InstrumentUpdateModalComponent {
  instrument: Instrument;
  name: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private performanceBadgesService: PerformanceBadgesService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<InstrumentUpdateModalComponent>
  ) {
    this.instrument = data.instrument;
    this.name = data.instrument.name;
  }

  update(form: NgForm) {
    const name = form.controls.instrumentName.value;

    this.performanceBadgesService.updateInstrument(this.instrument.id, name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchInstruments();
        this.notificationService.info('MANAGEMENT_PERFORMANCE_BADGES_UPDATE_INSTRUMENT_SUCCESSFUL');
      },
      (error) => console.log(error)
    );
    this.dialogRef.close();
  }
}
