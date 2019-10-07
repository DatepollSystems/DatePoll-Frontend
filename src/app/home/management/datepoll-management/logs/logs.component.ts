import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {LogsService} from './logs.service';
import {Log, LogType} from './log.model';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnDestroy {
  logs: Log[];
  logsCopy: Log[];
  logsSubscription: Subscription;

  selectedLogType: LogType = LogType.ERROR;
  logTypes: any[] = [
    {value: LogType.INFO, viewValue: 'Info'},
    {value: LogType.WARNING, viewValue: 'Warning'},
    {value: LogType.ERROR, viewValue: 'Error'}
  ];

  loading = true;

  constructor(private logsService: LogsService) {
    this.logs = this.logsService.getLogs();
    this.logsCopy = this.logs.slice();
    this.redoLogsList();
    this.logsSubscription = this.logsService.logsChange.subscribe((value) => {
      this.logs = value;
      this.logsCopy = this.logs.slice();
      this.redoLogsList();
      this.loading = false;
    });
  }

  selectedLogTypeChange(event: any) {
    this.redoLogsList();
  }

  refreshLogsList() {
    this.loading = true;
    this.logsService.getLogs();
  }

  applyFilter(filterValue: string) {
    this.logsCopy = [];
    for (const log of this.logs) {
      if (log.message.toUpperCase().includes(filterValue.toUpperCase())) {
        this.logsCopy.push(log);
      }
    }
  }

  private redoLogsList() {
    this.logsCopy = [];
    for (const log of this.logs) {
      if (log.type === this.selectedLogType) {
        this.logsCopy.push(log);
      }
    }
  }

  ngOnDestroy() {
    this.logsSubscription.unsubscribe();
  }
}
