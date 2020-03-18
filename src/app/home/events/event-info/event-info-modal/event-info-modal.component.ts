import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Event} from '../../models/event.model';

@Component({
  selector: 'app-event-info-modal',
  templateUrl: './event-info-modal.component.html',
  styleUrls: ['./event-info-modal.component.css']
})
export class EventInfoModalComponent {
  event: Event;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.event = data.event;
  }
}
