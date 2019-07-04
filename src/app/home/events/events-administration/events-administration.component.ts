import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet, MatDialog, MatPaginator, MatSlideToggleChange, MatSort, MatTableDataSource} from '@angular/material';
import {Event} from '../models/event.model';
import {Subscription} from 'rxjs';
import {EventsService} from '../events.service';
import {MyUserService} from '../../my-user.service';
import {Permissions} from '../../../permissions';
import {Router} from '@angular/router';
import {EventCreateModalComponent} from './event-create-modal/event-create-modal.component';
import {EventStandardDecisionsManagementModalComponent} from '../event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventUpdateModalComponent} from './event-update-modal/event-update-modal.component';
import {EventInfoModalComponent} from '../event-info-modal/event-info-modal.component';
import {EventDeleteModalComponent} from './event-delete-modal/event-delete-modal.component';

@Component({
  selector: 'app-events-administration',
  templateUrl: './events-administration.component.html',
  styleUrls: ['./events-administration.component.css']
})
export class EventsAdministrationComponent implements OnDestroy {
  @ViewChild('successfullyDeletedEvent', {static: true}) successfullyDeletedEvent: TemplateRef<any>;

  eventsLoaded = false;

  showAllEvents: boolean;

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'description', 'actions'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  events: Event[];
  eventsCopy: Event[];
  dataSource: MatTableDataSource<Event>;
  private eventsSubscription: Subscription;
  private permissionSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private myUserService: MyUserService) {

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.EVENTS_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });

    this.eventsLoaded = false;
    this.events = eventsService.getEvents();
    this.refreshTable();

    if (this.events.length > 0) {
      this.eventsLoaded = true;
    }

    this.eventsSubscription = this.eventsService.eventsChange.subscribe((value) => {
      this.events = value;
      this.eventsLoaded = true;
      this.refreshTable();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.permissionSubscription.unsubscribe();
  }

  refreshTable() {
    if (this.showAllEvents) {
      this.eventsCopy = this.events.slice();
    } else {
      this.eventsCopy = [];
      for (let i = 0; i < this.events.length; i++) {
        const now = new Date().getTime();
        if (this.events[i].endDate.getTime() > now) {
          this.eventsCopy.push(this.events[i]);
        }
      }
    }

    this.dataSource = new MatTableDataSource(this.eventsCopy);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onShowStandardDecisionManagementModal() {
    this.dialog.open(EventStandardDecisionsManagementModalComponent, {
      width: '80vh'
    });
  }

  onShowAllEventsChange(ob: MatSlideToggleChange) {
    this.refreshTable();
  }

  refreshEvents() {
    this.eventsLoaded = false;
    this.eventsService.fetchEvents();
    this.events = [];
    this.refreshTable();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCreate() {
    this.dialog.open(EventCreateModalComponent, {
      width: '80vh'
    });
  }

  onInfo(event: Event) {
    this.dialog.open(EventInfoModalComponent, {
      width: '80vh',
      'data': {
        'event': event
      }
    });
  }

  onEdit(event: Event) {
    this.dialog.open(EventUpdateModalComponent, {
      width: '80vh',
      'data': {
        'event': event
      }
    });
  }

  onDelete(id: number) {
    this.bottomSheet.open(EventDeleteModalComponent, {
      'data': {'eventID': id}
    });
  }

}
