import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import {Job} from '../jobs.model';

@Component({
  selector: 'app-job-view-modal',
  templateUrl: './job-view-modal.component.html',
  styleUrls: ['./job-view-modal.component.css']
})
export class JobViewModalComponent {
  job: Job;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.job = data.job;
  }
}
