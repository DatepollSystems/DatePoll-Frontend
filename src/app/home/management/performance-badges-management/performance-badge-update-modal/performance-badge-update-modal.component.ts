import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

import {PerformanceBadgesService} from '../performance-badges.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

import {PerformanceBadge} from '../models/performanceBadge.model';

@Component({
  selector: 'app-performance-badge-update-modal',
  templateUrl: './performance-badge-update-modal.component.html',
  styleUrls: ['./performance-badge-update-modal.component.css']
})
export class PerformanceBadgeUpdateModalComponent {

  @ViewChild('successfullyUpdatedPerformanceBadge', {static: true}) successfullyUpdatedPerformanceBadge: TemplateRef<any>;

  performanceBadge: PerformanceBadge;
  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private performanceBadgesService: PerformanceBadgesService,
              private notifationsService: NotificationsService,
              private dialogRef: MatDialogRef<PerformanceBadgeUpdateModalComponent>) {

    this.performanceBadge = data.performanceBadge;
    this.name = data.performanceBadge.name;
  }

  update(form: NgForm) {
    const name = form.controls.performanceBadgeName.value;

    this.performanceBadgesService.updatePerformanceBadge(this.performanceBadge.id, name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchPerformanceBadges();
        this.notifationsService.html(this.successfullyUpdatedPerformanceBadge, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    this.dialogRef.close();
  }

}
