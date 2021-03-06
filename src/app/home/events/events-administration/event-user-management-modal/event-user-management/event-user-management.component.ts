import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {EventsVoteForDecisionModalComponent} from '../../../events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';

import {EventsService} from '../../../services/events.service';
import {NotificationService} from '../../../../../utils/notification.service';
import {EventsUserService} from '../../../services/events-user.service';

import {EventResultUser} from '../../../models/event-result-user.model';
import {Event} from '../../../models/event.model';

@Component({
  selector: 'app-event-user-management',
  templateUrl: './event-user-management.component.html',
  styleUrls: ['./event-user-management.component.css'],
})
export class EventUserManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  event: Event;

  @Input()
  resultUsers: EventResultUser[] = [];

  savingVoting = false;
  savingClearVoting = false;

  // Table with user data
  displayedColumns: string[] = ['select', 'firstname', 'surname', 'decision'];
  filterValue: string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<EventResultUser>;
  selection = new SelectionModel<EventResultUser>(true, []);

  eventSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    private userEventsService: EventsUserService,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet
  ) {
    this.eventSubscription = this.userEventsService.eventChange.subscribe(() => {
      setTimeout(() => {
        this.refreshValues();
      }, 1000);
    });
  }

  ngOnInit() {
    this.refreshValues();
  }

  ngAfterViewInit(): void {
    // Refresh values again to apply mat sort
    this.refreshValues();
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  refreshValues() {
    this.dataSource = new MatTableDataSource(this.resultUsers);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onVote() {
    const selected = this.selection.selected.slice();
    console.log('eventUserManagement | Selected EventResultUsers: ' + selected);
    if (this.selection.selected.length === 0) {
      this.notificationService.info('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_VOTE_NO_ONE_SELECTED');
      return;
    }

    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {event: this.event},
    });
    bottomSheetRef.afterDismissed().subscribe((dto) => {
      if (dto != null) {
        const decision = dto.decision;

        this.savingVoting = true;
        this.eventsService.voteForUsers(this.event, decision, dto.additionalInformation, selected).subscribe(
          (response: any) => {
            console.log(response);

            this.savingVoting = false;
            this.selection.clear();
            this.userEventsService.getEvent(this.event.id);
            this.notificationService.info('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_VOTE_SUCCESSFULLY');
          },
          (error) => {
            console.log(error);
            this.userEventsService.getEvent(this.event.id);
          }
        );
      } else {
        console.log('eventUserManagement | Closed bottom sheet, voted for nohting');
      }
    });
  }

  onVoteForSingle(user: EventResultUser) {
    this.selection.select(user);
    this.onVote();
    this.selection.clear();
  }

  onClear() {
    console.log('eventUserManagement | Selected EventResultUsers: ' + this.selection.selected);
    if (this.selection.selected.length === 0) {
      this.notificationService.info('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_VOTE_NO_ONE_SELECTED');
      return;
    }
    this.savingClearVoting = true;
    this.eventsService.cancelVotingForUsers(this.event, this.selection.selected).subscribe(
      (response: any) => {
        console.log(response);

        this.savingClearVoting = false;
        this.selection.clear();
        this.userEventsService.getEvent(this.event.id);
        this.notificationService.info('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_REMOVE_VOTING_SUCCESSFULLY');
      },
      (error) => {
        console.log(error);
        this.userEventsService.getEvent(this.event.id);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EventResultUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
