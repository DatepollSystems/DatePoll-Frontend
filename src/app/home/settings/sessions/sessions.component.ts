import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Session} from './session.model';
import {Subscription} from 'rxjs';
import {SessionsService} from './sessions.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnDestroy {

  @ViewChild('successfullyRemovedSession') successfullyRemovedSession: TemplateRef<any>;

  displayedColumns: string[] = ['information', 'lastUsed', 'action'];
  dataSource: MatTableDataSource<Session>;

  sessions: Session[];
  sessionSubscription: Subscription;

  constructor(private sessionsService: SessionsService, private notificationsService: NotificationsService) {
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
        this.notificationsService.html(this.successfullyRemovedSession, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }

}
