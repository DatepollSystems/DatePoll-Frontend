import {Component, Inject, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {EventsService} from '../../events.service';

import {Decision} from '../../models/decision.model';
import {EventDate} from '../../models/event-date.model';
import {Event} from '../../models/event.model';

@Component({
  selector: 'app-event-update-modal',
  templateUrl: './event-update-modal.component.html',
  styleUrls: ['./event-update-modal.component.css']
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

  joinedCopy: any[] = [];
  joined: any[] = [];
  joinedSubscription: Subscription;

  freeCopy: any[] = [];
  free: any[] = [];
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

    this.joined = this.eventsService.getJoinedOfEvent(this.event.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.eventsService.joinedGroupsChange.subscribe(value => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();

      setTimeout(() => {
        // Check if elements are not null because if the user close the modal before the timeout, there will be thrown an error
        if (document.getElementById('joined-list') != null && document.getElementById('free-list') != null) {
          document.getElementById('joined-list').style.height = document.getElementById('free-list').clientHeight.toString() + 'px';
          console.log('Free height:' + document.getElementById('free-list').clientHeight);
          console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
        }
      }, 1000);
    });

    this.free = this.eventsService.getFreeOfEvent(this.event.id);
    this.freeCopy = this.free.slice();
    this.freeSubscription = this.eventsService.freeGroupsChange.subscribe(value => {
      this.free = value;
      this.freeCopy = this.free.slice();

      setTimeout(() => {
        // Check if elements are not null because if the user close the modal before the timeout, there will be thrown an error
        if (document.getElementById('joined-list') != null && document.getElementById('free-list') != null) {
          document.getElementById('free-list').style.height = document.getElementById('joined-list').clientHeight.toString() + 'px';
          console.log('Free height:' + document.getElementById('free-list').clientHeight);
          console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
        }
      }, 1000);
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

  update(form: NgForm) {
    if (this.dates.length === 0) {
      return;
    }

    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    const forEveryone = this.joined.length === 0;

    const event = new Event(this.event.id, name, this.startDate, this.endDate, forEveryone, description, this.decisions, this.dates);
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
      error => console.log(error)
    );

    // Groups and subgroups
    for (let i = 0; i < this.joined.length; i++) {
      const group = this.joined[i];

      let toUpdate = true;

      for (let j = 0; j < this.joinedCopy.length; j++) {
        if (group.type.includes(this.joinedCopy[j].type)) {
          if (group.id === this.joinedCopy[j].id) {
            toUpdate = false;
            console.log('toUpdate | joined | false | ' + group.name + ' | ' + this.joinedCopy[j].name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | joined | true | ' + group.name);

        if (group.type.includes('parentgroup')) {
          this.eventsService.addGroupToEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            error => console.log(error)
          );
        } else {
          this.eventsService.addSubgroupToEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            error => console.log(error)
          );
        }
      }
    }

    for (let i = 0; i < this.free.length; i++) {
      const group = this.free[i];

      let toUpdate = true;

      for (let j = 0; j < this.freeCopy.length; j++) {
        if (group.type.includes(this.freeCopy[j].type)) {
          if (group.id === this.freeCopy[j].id) {
            toUpdate = false;
            console.log('toUpdate | free | false | ' + group.name + ' | ' + this.freeCopy[j].name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | free | true | ' + group.name);

        if (group.type.includes('parentgroup')) {
          this.eventsService.removeGroupFromEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            error => console.log(error)
          );
        } else {
          this.eventsService.removeSubgroupFromEvent(this.event.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            error => console.log(error)
          );
        }
      }
    }
  }
}
