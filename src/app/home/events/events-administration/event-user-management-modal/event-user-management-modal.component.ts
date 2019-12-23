import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatBottomSheet, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {EventsService} from '../../events.service';

import {Event} from '../../models/event.model';
import {EventResultUser} from '../../models/event-result-user.model';
import {EventsVoteForDecisionModalComponent} from '../../events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';

@Component({
  selector: 'app-event-user-management-modal',
  templateUrl: './event-user-management-modal.component.html',
  styleUrls: ['./event-user-management-modal.component.css']
})
export class EventUserManagementModalComponent implements OnDestroy {
  event: Event;
  eventSubscription: Subscription;

  name: string;

  sendingRequest = true;
  savingVoting = false;
  savingClearVoting = false;

  // Table with user data
  displayedColumns: string[] = ['select', 'firstname', 'surname', 'decision'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: MatTableDataSource<EventResultUser>;
  selection = new SelectionModel<EventResultUser>(true, []);

  voteSummary: string = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EventUserManagementModalComponent>,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private bottomSheet: MatBottomSheet,
              private eventsService: EventsService) {
    this.event = data.event;
    this.refreshValues();

    this.event = this.eventsService.getEvent(this.event.id);
    this.eventSubscription = this.eventsService.eventChange.subscribe((value) => {
      this.event = value;
      this.refreshValues();
      this.sendingRequest = false;
      this.calculateVoteSummary();
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  refreshValues() {
    this.name = this.event.name;

    this.dataSource = new MatTableDataSource(this.event.getResultUsers());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onVote() {
    const selected = this.selection.selected.slice();
    console.log('eventUserManagement | Selected EventResultUsers: ' + selected);
    if (this.selection.selected.length === 0) {
      this.notificationsService.warn(this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_VOTE_NO_ONE_SELECTED'));
      return;
    }

    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {'event': this.event},
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
            this.eventsService.getEvent(this.event.id);
            this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
              this.translate.getTranslationFor('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_VOTE_SUCCESSFULLY'));
          },
          (error) => {
            console.log(error);
            this.eventsService.getEvent(this.event.id);
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
      this.notificationsService.warn(this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_VOTE_NO_ONE_SELECTED'));
      return;
    }
    this.savingClearVoting = true;
    this.eventsService.cancelVotingForUsers(this.event, this.selection.selected).subscribe(
      (response: any) => {
        console.log(response);

        this.savingClearVoting = false;
        this.selection.clear();
        this.eventsService.getEvent(this.event.id);
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('EVENTS_ADMINISTRATION_USER_MANAGEMENT_FOR_EVENT_REMOVE_VOTING_SUCCESSFULLY'));
      },
      (error) => {
        console.log(error);
        this.eventsService.getEvent(this.event.id);
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
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EventResultUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  getVotesSummary() {
    if (this.voteSummary == null) {
      this.calculateVoteSummary();
    }
    return this.voteSummary;
  }

  private calculateVoteSummary() {
    if (this.event == null) {
      return;
    }
    const objects = [];

    for (const decision of this.event.getDecisions()) {
      const object = {
        'id': decision.id,
        'name': decision.decision,
        'count': 0
      };
      objects.push(object);
    }

    for (const resultUser of this.event.getResultUsers()) {
      for (const object of objects) {
        if (resultUser.decisionId === object.id) {
          object.count += 1;
          break;
        }
      }
    }

    let stringToReturn = '';
    for (const object of objects) {
      stringToReturn += object.name + ': ' + object.count + ' ';
    }
    this.voteSummary = stringToReturn;
  }

}
