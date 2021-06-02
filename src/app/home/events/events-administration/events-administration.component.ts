import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {TranslateService} from '../../../translation/translate.service';
import {EventsService} from '../events.service';

import {Event} from '../models/event.model';

import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {EventInfoModalComponent} from '../event-info/event-info-modal/event-info-modal.component';
import {EventStandardDecisionsManagementModalComponent} from './event-standard-decisions-management-modal/event-standard-decisions-management-modal.component';
import {EventStandardLocationsManagementModalComponent} from './event-standard-locations-management-modal/event-standard-locations-management-modal.component';
import {EventUpdateModalComponent} from './event-update-modal/event-update-modal.component';
import {EventUserManagementModalComponent} from './event-user-management-modal/event-user-management-modal.component';
import {UIHelper} from '../../../utils/helper/UIHelper';
import {YearSelectComponent} from '../../../utils/shared-components/year-select/year-select.component';

@Component({
  selector: 'app-events-administration',
  templateUrl: './events-administration.component.html',
  styleUrls: ['./events-administration.component.css'],
})
export class EventsAdministrationComponent implements OnDestroy {
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

  years: string[];
  private yearsSubscription: Subscription;
  selectedYear: string = null;
  @ViewChild(YearSelectComponent) yearSelect: YearSelectComponent;

  private currentDate: Date;

  constructor(
    private eventsService: EventsService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {
    this.currentDate = UIHelper.getCurrentDate();

    this.years = this.eventsService.getYears();
    this.selectedYear = this.years[this.years.length - 1];
    this.yearsSubscription = eventsService.yearsChange.subscribe((value) => {
      this.years = value;
      this.selectedYear = this.years[this.years.length - 1];
      for (const year of this.years) {
        if (year.includes(this.currentDate.getFullYear().toString())) {
          this.selectedYear = year;
          break;
        }
      }

      this.yearSelect.initialize(this.selectedYear, this.years);

      this.eventsLoaded = false;
      this.events = eventsService.getEvents(this.selectedYear ? Number(this.selectedYear) : null);
      this.refreshTable();

      if (this.events.length > 0) {
        this.eventsLoaded = true;
      }

      this.eventsSubscription = this.eventsService.eventsChange.subscribe((eValue) => {
        this.events = eValue;
        this.eventsLoaded = true;
        this.refreshTable();
      });
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
      for (const event of this.events) {
        const now = this.currentDate.getTime();
        if (event.endDate.getTime() > now) {
          this.eventsCopy.push(event);
        }
      }
    }

    this.dataSource = new MatTableDataSource(this.eventsCopy);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onShowStandardDecisionManagementModal() {
    this.dialog.open(EventStandardDecisionsManagementModalComponent, {
      width: '80%',
    });
  }

  onShowStandardLocationManagementModal() {
    this.dialog.open(EventStandardLocationsManagementModalComponent, {
      width: '80%',
    });
  }

  onShowAllEventsChange() {
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
        event,
      },
    });
  }

  onUserManagement(event: Event) {
    this.dialog.open(EventUserManagementModalComponent, {
      width: '80%',
      data: {
        event,
      },
    });
  }

  onEdit(event: Event) {
    this.dialog.open(EventUpdateModalComponent, {
      width: '95%',
      data: {
        event,
      },
    });
  }

  onDelete(id: number) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'EVENTS_ADMINISTRATION_DELETE_EVENT_QUESTION',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.eventsService.deleteEvent(id).subscribe(
          (response: any) => {
            console.log(response);
            this.eventsService.fetchEvents();
            this.snackBar.open(this.translate.getTranslationFor('EVENTS_ADMINISTRATION_DELETE_EVENT_SUCCESSFULLY_DELETED'));
          },
          (error) => console.log(error)
        );
      }
    });
  }

  yearSelectChange(value) {
    this.selectedYear = value;
    if (!this.showAllEvents) {
      this.showAllEvents = Number(value) < this.currentDate.getFullYear();
    }
    this.eventsService.getEvents(value);
  }
}
