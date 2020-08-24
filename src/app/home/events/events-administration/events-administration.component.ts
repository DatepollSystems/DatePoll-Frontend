import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatBottomSheet, MatDialog, MatPaginator, MatSlideToggleChange, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {TranslateService} from '../../../translation/translate.service';
import {EventsService} from '../events.service';

import {Event} from '../models/event.model';

import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {EventInfoModalComponent} from '../event-info/event-info-modal/event-info-modal.component';
import {EventStandardDecisionsManagementModalComponent} from './event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventStandardLocationsManagementModalComponent} from './event-standard-locations-management-modal/event-standard-locations-management-modal.component';
import {EventUpdateModalComponent} from './event-update-modal/event-update-modal.component';
import {EventUserManagementModalComponent} from './event-user-management-modal/event-user-management-modal.component';

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

  constructor(
    private eventsService: EventsService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private notificationsService: NotificationsService,
    private bottomSheet: MatBottomSheet
  ) {
    this.eventsLoaded = false;
    this.events = eventsService.getEvents();
    this.refreshTable();

    if (this.events.length > 0) {
      this.eventsLoaded = true;
    }

    this.eventsSubscription = this.eventsService.eventsChange.subscribe(value => {
      this.events = value;
      this.eventsLoaded = true;
      this.refreshTable();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
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
      width: '80%'
    });
  }

  onShowStandardLocationManagementModal() {
    this.dialog.open(EventStandardLocationsManagementModalComponent, {
      width: '80%'
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
    this.router.navigateByUrl('/home/events/administration/create');
  }

  onInfo(event: Event) {
    this.dialog.open(EventInfoModalComponent, {
      width: '80%',
      data: {
        event
      }
    });
  }

  onUserManagement(event: Event) {
    this.dialog.open(EventUserManagementModalComponent, {
      width: '80%',
      data: {
        event
      }
    });
  }

  onEdit(event: Event) {
    this.dialog.open(EventUpdateModalComponent, {
      width: '95%',
      data: {
        event
      }
    });
  }

  onDelete(id: number) {
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
    const question = this.translate.getTranslationFor('EVENTS_ADMINISTRATION_DELETE_EVENT_QUESTION');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.eventsService.deleteEvent(id).subscribe(
            (response: any) => {
              console.log(response);
              this.eventsService.fetchEvents();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('EVENTS_ADMINISTRATION_DELETE_EVENT_SUCCESSFULLY_DELETED')
              );
            },
            error => console.log(error)
          );
        }
      }
    });
  }
}
