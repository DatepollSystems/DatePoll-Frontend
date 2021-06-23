import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {TranslateService} from '../../../../translation/translate.service';
import {StandardLocationsService} from '../../services/standardLocations.service';

import {EventStandardLocation} from '../../models/event-standard-location.model';

@Component({
  selector: 'app-event-standard-locations-management-modal',
  templateUrl: './event-standard-locations-management-modal.component.html',
  styleUrls: ['./event-standard-locations-management-modal.component.css'],
})
export class EventStandardLocationsManagementModalComponent implements OnDestroy {
  public standardLocations: EventStandardLocation[] = [];
  private standardLocationsSubscription: Subscription;

  public x = 0;
  public y = 0;

  constructor(
    private standardLocationsService: StandardLocationsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.standardLocations = this.standardLocationsService.getStandardLocations();
    this.standardLocationsSubscription = this.standardLocationsService.standardLocationsChange.subscribe((value) => {
      this.standardLocations = value;
    });
  }

  ngOnDestroy() {
    this.standardLocationsSubscription.unsubscribe();
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

    this.standardLocationsService.addStandardLocation(form.controls.location.value, x, y, form.controls.name.value).subscribe(
      (response: any) => {
        console.log(response);

        this.standardLocationsService.fetchStandardLocations();

        this.snackBar.open(this.translate.getTranslationFor('EVENTS_STANDARD_LOCATIONS_MANAGEMENT_SUCCESSFULLY_ADDED'));
      },
      (error) => console.log(error)
    );

    form.reset();
  }

  deleteStandardLocation(standardLocation: EventStandardLocation) {
    this.standardLocationsService.removeStandardLocation(standardLocation.id).subscribe(
      (response: any) => {
        console.log(response);

        this.standardLocationsService.fetchStandardLocations();

        this.snackBar.open(this.translate.getTranslationFor('EVENTS_STANDARD_LOCATIONS_MANAGEMENT_SUCCESSFULLY_REMOVED'));
      },
      (error) => console.log(error)
    );
  }
}
