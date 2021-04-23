import {Component, OnDestroy} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

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

  constructor(private sessionsService: SessionsService, private snackBar: MatSnackBar, private translate: TranslateService) {
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
        this.snackBar.open(this.translate.getTranslationFor('SETTINGS_SECURITY_MODAL_SESSION_REMOVED_SUCCESSFUL'));
      },
      (error) => console.log(error)
    );
  }
}
