import {Component, OnDestroy} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';

import {SessionsService} from './sessions.service';
import {TranslateService} from '../../../translation/translate.service';
import {Session} from './session.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
})
export class SessionsComponent implements OnDestroy {
  displayedColumns: string[] = ['information', 'lastUsed', 'action'];
  dataSource: MatTableDataSource<Session>;

  sessions: Session[];
  sessionSubscription: Subscription;

  constructor(
    private sessionsService: SessionsService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.sessions = this.sessionsService.getSessions();
    this.dataSource = new MatTableDataSource(this.sessions);
    this.sessionSubscription = this.sessionsService.sessionsChange.subscribe((value) => {
      this.sessions = value;
      this.dataSource = new MatTableDataSource(this.sessions);
    });
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeSession(id: number) {
    this.sessionsService.removeSession(id).subscribe(
      (data: any) => {
        console.log(data);
        this.sessionsService.fetchSessions();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('SETTINGS_SECURITY_MODAL_SESSION_REMOVED_SUCCESSFUL')
        );
      },
      (error) => console.log(error)
    );
  }
}
