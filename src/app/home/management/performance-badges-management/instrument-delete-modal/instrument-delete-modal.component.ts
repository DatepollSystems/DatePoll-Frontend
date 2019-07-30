import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {PerformanceBadgesService} from '../performance-badges.service';

@Component({
  selector: 'app-instrument-delete-modal',
  templateUrl: './instrument-delete-modal.component.html',
  styleUrls: ['./instrument-delete-modal.component.css']
})
export class InstrumentDeleteModalComponent {
  instrumentId: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<InstrumentDeleteModalComponent>,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private performanceBadgesService: PerformanceBadgesService) {
    this.instrumentId = data.instrumentId;
  }

  yes() {
    this.performanceBadgesService.removeInstrument(this.instrumentId).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchInstruments();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_REMOVED_INSTRUMENT_SUCCESSFUL'));
      },
      (error) => {
        console.log(error);
        this.performanceBadgesService.fetchInstruments();
      }
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
