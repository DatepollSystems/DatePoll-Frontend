import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import {MapsComponentComponent} from '../../../../services/shared-components/maps-component/maps.component';

import {EventDate} from '../../models/event-date.model';
import {EventStandardLocation} from '../../models/event-standard-location.model';

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
  public location = null;

  @ViewChild(MapsComponentComponent, {static: true}) mapsComponent: MapsComponentComponent;

  createNewEventDateDate = new Date();

  selectedStandardLocation: EventStandardLocation;

  constructor() {}

  onStandardLocationChanged(standardLocation: EventStandardLocation) {
    console.log('Selected standard location: ' + standardLocation.name);
    this.selectedStandardLocation = standardLocation;
  }

  applyStandardLocation() {
    if (this.selectedStandardLocation == null) {
      return;
    }
    this.x = this.selectedStandardLocation.x;
    this.y = this.selectedStandardLocation.y;
    this.location = this.selectedStandardLocation.location;
    this.mapsComponent.drawMarker(this.x, this.y);
  }

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

    form.reset();
    this.mapsComponent.removeMarker();
    // Recreate date to not override first date while creating a new date object
    this.createNewEventDateDate = new Date();
  }
}
