import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs';

import {IsMobileService} from '../../../services/is-mobile.service';

import {EventDate} from '../models/event-date.model';

@Component({
  selector: 'app-event-dates-list',
  templateUrl: './event-dates-list.component.html',
  styleUrls: ['./event-dates-list.component.css']
})
export class EventDatesListComponent implements OnDestroy {
  @Input()
  public dates: EventDate[] = [];

  @Input()
  public adminView = false;

  @Output()
  public datesChanged = new EventEmitter();

  isMobile = false;
  isMobileSubscription: Subscription;

  constructor(private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe(value => {
      this.isMobile = value;
    });
  }

  ngOnDestroy(): void {
    this.isMobileSubscription.unsubscribe();
  }

  deleteDate(dateToDelete: EventDate) {
    const newDates = [];
    for (const date of this.dates) {
      if (
        date.location !== dateToDelete.location ||
        date.date !== dateToDelete.date ||
        dateToDelete.x !== date.x ||
        date.y !== dateToDelete.y
      ) {
        newDates.push(date);
      }
    }
    this.dates = newDates;
    this.datesChanged.emit(this.dates.slice());
  }
}
