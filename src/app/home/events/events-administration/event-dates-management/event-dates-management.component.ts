import {Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {IsMobileService} from '../../../../utils/is-mobile.service';
import {SettingsService} from '../../../../utils/settings.service';
import {Generator} from '../../../../utils/helper/Generator';
import {Converter} from '../../../../utils/helper/Converter';

import {MapsComponent} from '../../../../utils/shared-components/maps-component/maps.component';
import {TimeInputComponent} from '../../../../utils/shared-components/time-input/time-input.component';

import {EventDate} from '../../models/event-date.model';
import {EventStandardLocation} from '../../models/event-standard-location.model';

@Component({
  selector: 'app-event-dates-management',
  templateUrl: './event-dates-management.component.html',
  styleUrls: ['./event-dates-management.component.css'],
})
export class EventDatesManagementComponent implements OnDestroy {
  @Input()
  public dates: EventDate[];

  @Output()
  public datesChange = new EventEmitter();

  public x = 0;
  public y = 0;
  public location = null;
  time: string;

  @ViewChild(MapsComponent, {static: true}) mapsComponent: MapsComponent;
  @ViewChild(TimeInputComponent, {static: true}) timeComponent: TimeInputComponent;

  createNewEventDateDate = new Date();

  isMobile = true;
  isMobileSubscription: Subscription;

  jitsiMeetInstanceUrl: string;
  jitsiMeetInstanceUrlSubscription: Subscription;

  constructor(private isMobileService: IsMobileService, private settingsService: SettingsService) {
    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe((value) => {
      this.isMobile = value;
    });

    this.jitsiMeetInstanceUrl = this.settingsService.getJistiMeetInstanceUrl();
    this.jitsiMeetInstanceUrlSubscription = this.settingsService.jitsiMeetInstanceUrlChange.subscribe((value) => {
      this.jitsiMeetInstanceUrl = value;
    });
  }

  ngOnDestroy() {
    this.isMobileSubscription.unsubscribe();
    this.jitsiMeetInstanceUrlSubscription.unsubscribe();
  }

  onStandardLocationChanged(standardLocation: EventStandardLocation) {
    if (standardLocation == null) {
      this.x = 0;
      this.y = 0;
      this.location = '';
      return;
    }

    console.log('Selected standard location: ' + standardLocation.name);
    this.x = standardLocation.x !== -199 ? standardLocation.x : 0;
    this.y = standardLocation.y !== -199 ? standardLocation.y : 0;
    if (standardLocation.x !== -199 && standardLocation.y !== -199) {
      this.mapsComponent.drawMarker(this.x, this.y);
    }
    this.location = standardLocation.location;
  }

  onDatesChange(dates: EventDate[]) {
    this.dates = dates;
    this.datesChange.emit(this.dates.slice());
  }

  onCoordinatesChange(coordinates: any) {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  onTimeChange(event: any) {
    this.time = event;
  }

  generateRandomJitsiMeetConferenceUrl() {
    this.location = this.jitsiMeetInstanceUrl + '/' + Generator.generateRandomString(10);
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
    this.createNewEventDateDate.setHours(Converter.stringToNumber(this.time.split(':')[0]));
    this.createNewEventDateDate.setMinutes(Converter.stringToNumber(this.time.split(':')[1]));
    const date = new EventDate(-1, form.controls.location.value, x, y, this.createNewEventDateDate, description);
    this.dates.push(date);
    this.datesChange.emit(this.dates.slice());
    console.log('Added event date');
    console.log(date);

    const d = this.createNewEventDateDate.getTime();
    form.reset();
    this.mapsComponent.removeMarker(true);
    // Recreate date to not override first date while creating a new date object
    this.createNewEventDateDate = new Date(d);
    // Explicitely reset time input
    this.timeComponent.reset();
  }
}
