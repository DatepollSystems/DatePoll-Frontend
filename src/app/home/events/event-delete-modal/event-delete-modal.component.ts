import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {NotificationsService, NotificationType} from 'angular2-notifications';
import {EventsService} from '../events.service';

@Component({
  selector: 'app-event-delete-modal',
  templateUrl: './event-delete-modal.component.html',
  styleUrls: ['./event-delete-modal.component.css']
})
export class EventDeleteModalComponent {
  @ViewChild('successfullyDeletedEvent', {static: true}) successfullyDeletedEvent: TemplateRef<any>;
  eventID: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<EventDeleteModalComponent>,
              private notificationsService: NotificationsService,
              private eventsService: EventsService) {
    this.eventID = data.eventID;
  }

  yes() {
    this.eventsService.deleteEvent(this.eventID).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsService.fetchEvents();
        this.notificationsService.html(this.successfullyDeletedEvent, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
