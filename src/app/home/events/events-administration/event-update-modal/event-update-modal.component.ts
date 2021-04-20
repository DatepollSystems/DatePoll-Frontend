import {Component, Inject, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {EventsService} from '../../events.service';

import {GroupAndSubgroupModel, GroupType} from '../../../../utils/models/groupAndSubgroup.model';
import {Decision} from '../../models/decision.model';
import {EventDate} from '../../models/event-date.model';
import {Event} from '../../models/event.model';

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
  decisions: Decision[] = [];
  dates: EventDate[] = [];

  startDate: Date;
  endDate: Date;

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
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private eventsService: EventsService
  ) {
    this.event = data.event;
    this.name = this.event.name;
    this.description = this.event.description;
    this.decisions = this.event.getDecisions();
    this.startDate = new Date();
    this.endDate = new Date();
    this.dates = this.event.getEventDates();
    this.allMembers = this.event.forEveryone;

    this.joined = this.eventsService.getJoinedOfEvent(this.event.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.eventsService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();
    });

    this.free = this.eventsService.getFreeOfEvent(this.event.id);
    this.freeCopy = this.free.slice();
    this.freeSubscription = this.eventsService.freeGroupsChange.subscribe((value) => {
      this.free = value;
      this.freeCopy = this.free.slice();
    });
  }

  public ngOnDestroy(): void {
    this.joinedSubscription.unsubscribe();
    this.freeSubscription.unsubscribe();
  }

  onDecisionsChange(decisions: Decision[]) {
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
      this.notificationsService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_DATE_LIST_REQUIRED')
      );
      return;
    }

    if (this.joined.length === 0 && !this.allMembers) {
      console.log('Groups length 0! - ' + this.joined.length + ' And allMembers - ' + this.allMembers);
      this.notificationsService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_NO_GROUPS_AND_NOT_ALL_MEMBERS')
      );
      return;
    }

    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    const event = new Event(this.event.id, name, this.startDate, this.endDate, this.allMembers, description, this.decisions, this.dates);
    console.log(event);
    this.eventsService.updateEvent(event).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsService.fetchEvents();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('EVENTS_ADMINISTRATION_UPDATE_EVENT_SUCCESSFULLY_UPDATED')
        );
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
          this.eventsService.addGroupToEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.eventsService.addSubgroupToEvent(this.event.id, group.id).subscribe(
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
          this.eventsService.removeGroupFromEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.eventsService.removeSubgroupFromEvent(this.event.id, group.id).subscribe(
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
