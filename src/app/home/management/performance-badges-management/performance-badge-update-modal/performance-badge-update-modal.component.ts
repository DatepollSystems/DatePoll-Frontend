import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

import {PerformanceBadgesService} from '../performance-badges.service';
import {PerformanceBadge} from '../models/performanceBadge.model';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-performance-badge-update-modal',
  templateUrl: './performance-badge-update-modal.component.html',
  styleUrls: ['./performance-badge-update-modal.component.css'],
})
export class PerformanceBadgeUpdateModalComponent {
  performanceBadge: PerformanceBadge;
  name: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private performanceBadgesService: PerformanceBadgesService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<PerformanceBadgeUpdateModalComponent>
  ) {
    this.performanceBadge = data.performanceBadge;
    this.name = data.performanceBadge.name;
  }

  update(form: NgForm) {
    const name = form.controls.performanceBadgeName.value;

    this.performanceBadgesService.updatePerformanceBadge(this.performanceBadge.id, name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchPerformanceBadges();
        this.notificationService.info('MANAGEMENT_PERFORMANCE_BADGES_UPDATE_PERFORMANCE_BADGE_SUCCESSFUL');
      },
      (error) => console.log(error)
    );
    this.dialogRef.close();
  }
}
