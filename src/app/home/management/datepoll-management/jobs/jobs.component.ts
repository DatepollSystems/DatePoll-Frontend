import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {JobsService} from './jobs.service';

import {JobViewModalComponent} from './job-view-modal/job-view-modal.component';
import {Job} from './jobs.model';
import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../auth/auth.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnDestroy {
  apiUrl = environment.apiUrl.slice(0, environment.apiUrl.length - 3) + 'logs';
  token = '';

  jobs: Job[];
  jobsCopy: Job[];
  jobsSubscription: Subscription;

  loading = true;

  constructor(private jobsService: JobsService, private dialog: MatDialog, private authService: AuthService) {
    this.jobs = this.jobsService.getJobs();
    this.jobsCopy = this.jobs.slice();
    this.jobsSubscription = this.jobsService.jobsChange.subscribe((value) => {
      this.jobs = value;
      this.jobsCopy = this.jobs.slice();
      this.loading = false;
    });

    this.token = this.authService.getJWTToken();
  }

  refreshLogsList() {
    this.loading = true;
    this.jobsService.getJobs();
  }

  applyFilter(filterValue: string) {
    this.jobsCopy = [];
    for (const log of this.jobs) {
      const filter = filterValue.toUpperCase().trim();

      if (
        log.queue.toUpperCase().trim().includes(filter) ||
        log.connection.toUpperCase().trim().includes(filter) ||
        log.payload.toUpperCase().trim().includes(filter) ||
        log.exception.toUpperCase().trim().includes(filter) ||
        log.failedAt.toString().toUpperCase().trim().includes(filter)
      ) {
        this.jobsCopy.push(log);
      }
    }
  }

  ngOnDestroy() {
    this.jobsSubscription.unsubscribe();
  }

  openJobInfo(job: Job) {
    this.dialog.open(JobViewModalComponent, {
      width: '80vh',
      data: {job},
    });
  }
}
