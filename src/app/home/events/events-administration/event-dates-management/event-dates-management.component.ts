import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

import {EventDate} from '../../models/event-date.model';

@Component({
  selector: 'app-event-dates-management',
  templateUrl: './event-dates-management.component.html',
  styleUrls: ['./event-dates-management.component.css']
})
export class EventDatesManagementComponent {
  @Input()
  public dates: EventDate[];

  @Output()
  public datesChange = new EventEmitter();

  public x = 0;
  public y = 0;

  createNewEventDateDate = new Date();

  constructor() {}

  onDatesChange(dates: EventDate[]) {
    this.dates = dates;
    this.datesChange.emit(this.dates.slice());
  }

  onCoordinatesChange(coordinates: any) {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  save(form: NgForm) {
    let x = form.controls.x.value;
    let y = form.controls.y.value;
    if (x == null || x === 0) {
      x = -199;
    }
    if (y == null || y === 0) {
      y = -199;
    }
    const description = '';
    this.createNewEventDateDate.setHours(form.controls.dateHours.value);
    this.createNewEventDateDate.setMinutes(form.controls.dateMinutes.value);
    const date = new EventDate(-1, form.controls.location.value, x, y, this.createNewEventDateDate, description);
    this.dates.push(date);
    this.datesChange.emit(this.dates.slice());
    console.log('Added event date');
    console.log(date);

    // Recreate date to not override first date while creating a new date object
    this.createNewEventDateDate = new Date();
  }
}
