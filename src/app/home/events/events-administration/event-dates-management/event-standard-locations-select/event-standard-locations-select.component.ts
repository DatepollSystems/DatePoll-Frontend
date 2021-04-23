import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {StandardLocationsService} from '../../../standardLocations.service';

import {PerformanceBadge} from '../../../../management/performance-badges-management/models/performanceBadge.model';
import {EventStandardLocation} from '../../../models/event-standard-location.model';

@Component({
  selector: 'app-event-standard-locations-select',
  templateUrl: './event-standard-locations-select.component.html',
  styleUrls: ['./event-standard-locations-select.component.css'],
})
export class EventStandardLocationsSelectComponent implements OnInit, OnDestroy {
  public standardLocationFilterCtrl: FormControl = new FormControl();
  public filteredStandardLocations: ReplaySubject<PerformanceBadge[]> = new ReplaySubject<PerformanceBadge[]>(1);

  protected _onDestroy = new Subject<void>();

  standardLocations: EventStandardLocation[];
  standardLocationsSubscription: Subscription;

  selectedStandardLocation: EventStandardLocation;

  @Output()
  standardLocationChanged = new EventEmitter();

  constructor(private standardLocationsService: StandardLocationsService) {
    this.standardLocations = this.standardLocationsService.getStandardLocations();
    if (this.standardLocations == null) {
      this.standardLocations = [];
    }
    this.filteredStandardLocations.next(this.standardLocations.slice());
    this.standardLocationsSubscription = this.standardLocationsService.standardLocationsChange.subscribe((value) => {
      this.standardLocations = value;
      if (this.standardLocations == null) {
        this.standardLocations = [];
      }
      this.filteredStandardLocations.next(this.standardLocations.slice());
    });
  }

  ngOnInit() {
    // load the initial standard locations list
    this.filteredStandardLocations.next(this.standardLocations.slice());

    // listen for search field value changes
    this.standardLocationFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterStandardLocations();
    });
  }

  ngOnDestroy(): void {
    this.standardLocationsSubscription.unsubscribe();
  }

  standardLocationSelectChange(value) {
    this.selectedStandardLocation = value;
    this.standardLocationChanged.emit(this.selectedStandardLocation);
  }

  private filterStandardLocations() {
    if (!this.standardLocations) {
      return;
    }
    // get the search keyword
    let search = this.standardLocationFilterCtrl.value;
    if (!search) {
      this.filteredStandardLocations.next(this.standardLocations.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the standard location
    this.filteredStandardLocations.next(this.standardLocations.filter((p) => p.name.toString().toLowerCase().indexOf(search) > -1));
  }
}
