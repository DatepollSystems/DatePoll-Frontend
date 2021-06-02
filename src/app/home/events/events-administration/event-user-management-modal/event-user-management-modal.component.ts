import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {EventsUserService} from '../../events-user.service';
import {Event} from '../../models/event.model';

@Component({
  selector: 'app-event-user-management-modal',
  templateUrl: './event-user-management-modal.component.html',
  styleUrls: ['./event-user-management-modal.component.css'],
})
export class EventUserManagementModalComponent implements OnDestroy {
  event: Event;
  eventSubscription: Subscription;
  name: string;
  sendingRequest = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private userEventsService: EventsUserService) {
    this.event = data.event;
    this.name = this.event.name;

    this.event = this.userEventsService.getEvent(this.event.id);
    this.eventSubscription = this.userEventsService.eventChange.subscribe((value) => {
      this.event = value;
      this.name = this.event.name;
      this.sendingRequest = false;
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
