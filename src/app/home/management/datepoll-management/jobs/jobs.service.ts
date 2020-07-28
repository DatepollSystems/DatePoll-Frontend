import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../../utils/converter';
import {HttpService} from '../../../../utils/http.service';

import {Job} from './jobs.model';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private jobs: Job[] = [];
  public jobsChange: Subject<Job[]> = new Subject<Job[]>();

  constructor(private httpService: HttpService) {}

  public getJobs(): Job[] {
    this.fetchJobs();
    return this.jobs.slice();
  }

  private setJobs(jobs: Job[]) {
    this.jobs = jobs;
    this.jobsChange.next(this.jobs.slice());
  }

  private fetchJobs() {
    this.httpService.loggedInV1GETRequest('/system/jobs', 'fetchJobs').subscribe(
      (response: any) => {
        console.log(response);

        const jobs = [];
        for (const job of response.jobs) {
          jobs.push(new Job(job.id, job.connection, job.queue, job.payload, job.exception, Converter.getIOSDate(job.failed_at)));
        }

        this.setJobs(jobs);
      },
      error => console.log(error)
    );
  }
}
