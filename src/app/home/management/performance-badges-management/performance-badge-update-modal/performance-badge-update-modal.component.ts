import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

import {NotificationsService} from 'angular2-notifications';

import {PerformanceBadgesService} from '../performance-badges.service';
import {TranslateService} from '../../../../translation/translate.service';
import {PerformanceBadge} from '../models/performanceBadge.model';

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
    private notifationsService: NotificationsService,
    private translate: TranslateService,
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
        this.notifationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_UPDATE_PERFORMANCE_BADGE_SUCCESSFUL')
        );
      },
      (error) => console.log(error)
    );
    this.dialogRef.close();
  }
}
