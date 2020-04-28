import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';
import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';
import {TranslateService} from '../../../../translation/translate.service';
import {Log, LogType} from './log.model';
import {LogsService} from './logs.service';

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

  constructor(private logsService: LogsService, private bottomSheet: MatBottomSheet, private translate: TranslateService) {
    this.logs = this.logsService.getLogs();
    this.logsCopy = this.logs.slice();
    this.redoLogsList();
    this.logsSubscription = this.logsService.logsChange.subscribe(value => {
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

  deleteLogList() {
    const answers = [
      {
        answer: this.translate.getTranslationFor('YES'),
        value: 'yes'
      },
      {
        answer: this.translate.getTranslationFor('NO'),
        value: 'no'
      }
    ];
    const question = this.translate.getTranslationFor('MANAGEMENT_DATEPOLL_LOGS_DELETE_CONFIRM');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.logsService.deleteLogs();
        }
      }
    });
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
