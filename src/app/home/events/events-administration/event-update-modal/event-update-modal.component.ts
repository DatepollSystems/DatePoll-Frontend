import {Component, Inject, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {TranslateService} from '../../../../translation/translate.service';
import {EventsService} from '../../services/events.service';

import {
  GroupAndSubgroupModel,
  GroupType,
} from '../../../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';
import {EventDecision} from '../../models/event-decision.model';
import {EventDate} from '../../models/event-date.model';
import {Event} from '../../models/event.model';
import {UIHelper} from '../../../../utils/helper/UIHelper';
import {EventsCreateUpdateService} from '../../services/eventsCreateUpdate.service';

@Component({
  selector: 'app-event-update-modal',
  templateUrl: './event-update-modal.component.html',
  styleUrls: ['./event-update-modal.component.css'],
})
export class EventUpdateModalComponent implements OnDestroy {
  event: Event;

  name: string;
  description: string;
  location: string;
  decisions: EventDecision[] = [];
  dates: EventDate[] = [];

  allMembers = false;

  joinedCopy: GroupAndSubgroupModel[] = [];
  joined: GroupAndSubgroupModel[] = [];
  joinedSubscription: Subscription;

  freeCopy: GroupAndSubgroupModel[] = [];
  free: GroupAndSubgroupModel[] = [];
  freeSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EventUpdateModalComponent>,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private eventsService: EventsService,
    private eventsCreateUpdateService: EventsCreateUpdateService
  ) {
    this.event = data.event;
    this.name = this.event.name;
    this.description = this.event.description;
    this.decisions = this.event.getDecisions();
    this.dates = this.event.getEventDates();
    this.allMembers = this.event.forEveryone;

    this.joined = this.eventsCreateUpdateService.getJoinedOfEvent(this.event.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.eventsCreateUpdateService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();
    });

    this.free = this.eventsCreateUpdateService.getFreeOfEvent(this.event.id);
    this.freeCopy = this.free.slice();
    this.freeSubscription = this.eventsCreateUpdateService.freeGroupsChange.subscribe((value) => {
      this.free = value;
      this.freeCopy = this.free.slice();
    });
  }

  public ngOnDestroy(): void {
    this.joinedSubscription.unsubscribe();
    this.freeSubscription.unsubscribe();
  }

  onDecisionsChange(decisions: EventDecision[]) {
    this.decisions = decisions;
  }

  onFreeChange(free: any[]) {
    this.free = free;
  }

  onJoinedChange(joined: any[]) {
    this.joined = joined;
  }

  onEventDatesChange(eventDates: EventDate[]) {
    this.dates = eventDates;
  }

  allMembersChanged(checked: boolean) {
    this.allMembers = checked;
  }

  update(form: NgForm) {
    if (this.dates.length === 0) {
      this.snackBar.open(this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_DATE_LIST_REQUIRED'));
      return;
    }

    if (this.joined.length === 0 && !this.allMembers) {
      console.log('Groups length 0! - ' + this.joined.length + ' And allMembers - ' + this.allMembers);
      this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_NO_GROUPS_AND_NOT_ALL_MEMBERS'));
      return;
    }

    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const currentDate = UIHelper.getCurrentDate();

    const event = new Event(this.event.id, name, currentDate, currentDate, this.allMembers, description, this.decisions, this.dates);
    console.log(event);
    this.eventsCreateUpdateService.updateEvent(event).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsService.fetchEvents();
        this.snackBar.open(this.translate.getTranslationFor('EVENTS_ADMINISTRATION_UPDATE_EVENT_SUCCESSFULLY_UPDATED'));
      },
      (error) => console.log(error)
    );

    // Groups and subgroups
    for (const group of this.joined) {
      let toUpdate = true;

      for (const joinedCopy of this.joinedCopy) {
        if (group.type === joinedCopy.type) {
          if (group.id === joinedCopy.id) {
            toUpdate = false;
            console.log('toUpdate | joined | false | ' + group.name + ' | ' + joinedCopy.name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | joined | true | ' + group.name);

        if (group.type === GroupType.PARENTGROUP) {
          this.eventsCreateUpdateService.addGroupToEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.eventsCreateUpdateService.addSubgroupToEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

    for (const group of this.free) {
      let toUpdate = true;

      for (const freeCopy of this.freeCopy) {
        if (group.type === freeCopy.type) {
          if (group.id === freeCopy.id) {
            toUpdate = false;
            console.log('toUpdate | free | false | ' + group.name + ' | ' + freeCopy.name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | free | true | ' + group.name);

        if (group.type === GroupType.PARENTGROUP) {
          this.eventsCreateUpdateService.removeGroupFromEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.eventsCreateUpdateService.removeSubgroupFromEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }
  }
}
