import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {NotificationsService} from 'angular2-notifications';

import {PerformanceBadgesService} from '../performance-badges.service';
import {TranslateService} from '../../../../translation/translate.service';

@Component({
  selector: 'app-performance-badge-delete-modal',
  templateUrl: './performance-badge-delete-modal.component.html',
  styleUrls: ['./performance-badge-delete-modal.component.css']
})
export class PerformanceBadgeDeleteModalComponent {
  performanceBadgeId: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<PerformanceBadgeDeleteModalComponent>,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private performanceBadgesService: PerformanceBadgesService) {
    this.performanceBadgeId = data.performanceBadgeId;
  }

  yes() {
    this.performanceBadgesService.removePerformanceBadge(this.performanceBadgeId).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchPerformanceBadges();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_REMOVED_PERFORMANCE_BADGE_SUCCESSFUL'));
      },
      (error) => {
        console.log(error);
        this.performanceBadgesService.fetchPerformanceBadges();
      }
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
