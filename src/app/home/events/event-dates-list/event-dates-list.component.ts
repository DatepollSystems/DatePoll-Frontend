import {Component, EventEmitter, Input, Output} from '@angular/core';

import {EventDate} from '../models/event-date.model';

@Component({
  selector: 'app-event-dates-list',
  templateUrl: './event-dates-list.component.html',
  styleUrls: ['./event-dates-list.component.css']
})
export class EventDatesListComponent {

  @Input()
  public dates: EventDate[] = [];

  @Input()
  public adminView = false;

  @Output()
  public datesChanged = new EventEmitter();

  constructor() {
  }

  deleteDate(dateToDelete: EventDate) {
    const newDates = [];
    for (const date of this.dates) {
      if (date.location !== dateToDelete.location || date.date !== dateToDelete.date || dateToDelete.x !== date.x
        || date.y !== dateToDelete.y) {
        newDates.push(date);
      }
    }
    this.dates = newDates;
    this.datesChanged.emit(this.dates.slice());
  }

}
