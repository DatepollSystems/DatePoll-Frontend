import {Component, Inject, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NotificationsService, NotificationType} from 'angular2-notifications';
import {EventsService} from '../../events.service';
import {NgForm} from '@angular/forms';
import {Event} from '../../models/event.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-event-update-modal',
  templateUrl: './event-update-modal.component.html',
  styleUrls: ['./event-update-modal.component.css']
})
export class EventUpdateModalComponent implements OnDestroy {
  @ViewChild('successfullyUpdatedEvent', {static: true}) successfullyUpdatedEvent: TemplateRef<any>;
  sendingRequest = false;

  event: Event;

  name: string;
  description: string;
  decisions: string[] = [];

  startDate: Date;
  startDateHours: number;
  startDateMinutes: number;
  endDate: Date;
  endDateHours: number;
  endDateMinutes: number;

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
    private eventsService: EventsService) {

    this.event = data.event;
    this.name = this.event.name;
    this.description = this.event.description;
    this.decisions = this.event.getDecisions();
    this.startDate = this.event.startDate;
    this.startDateHours = this.startDate.getHours();
    this.startDateMinutes = this.startDate.getMinutes();
    this.endDate = this.event.endDate;
    this.endDateHours = this.endDate.getHours();
    this.endDateMinutes = this.endDate.getMinutes();

    this.joined = this.eventsService.getJoinedOfEvent(this.event.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.eventsService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();

      setTimeout(function () {
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
    this.freeSubscription = this.eventsService.freeGroupsChange.subscribe((value) => {
      this.free = value;
      this.freeCopy = this.free.slice();

      setTimeout(function () {
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

  onDecisionsChange(decisions: string[]) {
    this.decisions = decisions;
  }

  onFreeChange(free: any[]) {
    this.free = free;
  }

  onJoinedChange(joined: any[]) {
    this.joined = joined;
  }

  update(form: NgForm) {
    this.sendingRequest = true;

    const name = form.controls.name.value;
    const startDateHours = form.controls.startDateHours.value;
    const startDateMinutes = form.controls.startDateMinutes.value;
    const endDateHours = form.controls.endDateHours.value;
    const endDateMinutes = form.controls.endDateMinutes.value;
    const description = form.controls.description.value;

    this.startDate.setHours(startDateHours);
    this.startDate.setMinutes(startDateMinutes);
    this.endDate.setHours(endDateHours);
    this.endDate.setMinutes(endDateMinutes);

    const forEveryone = (this.joined.length === 0);

    const event = new Event(this.event.id, name, this.startDate, this.endDate, forEveryone, description, this.decisions);
    console.log(event);
    this.dialogRef.close();
    this.eventsService.updateEvent(event).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsService.fetchEvents();
        this.notificationsService.html(this.successfullyUpdatedEvent, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );

    /** Groups and subgroups **/
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
