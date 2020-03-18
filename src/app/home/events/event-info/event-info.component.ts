import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';

import {Permissions} from '../../../permissions';
import {MyUserService} from '../../my-user.service';
import {EventsService} from '../events.service';

import {EventDate} from '../models/event-date.model';
import {EventResultGroup} from '../models/event-result-group.model';
import {Event} from '../models/event.model';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent implements OnInit, OnDestroy {
  sendingRequest = true;

  eventSubscription: Subscription;
  event: Event;
  @Input()
  eventId = null;

  @Output()
  eventLoaded = new EventEmitter<Event>();

  name: string;
  description: string;

  startDate: Date;
  endDate: Date;
  dates: EventDate[] = [];

  resultGroups: EventResultGroup[];
  sortedResultGroups: EventResultGroup[];
  searchValue = '';

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  constructor(private eventsService: EventsService, myUserService: MyUserService) {
    this.myUserService = myUserService;
  }

  ngOnInit(): void {
    if (this.eventId != null) {
      this.event = this.eventsService.getEvent(this.eventId);
      this.eventSubscription = this.eventsService.eventChange.subscribe(value => {
        this.event = value;
        this.refreshValues();
        this.sendingRequest = false;

        this.eventLoaded.emit(this.event);
      });
    }
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  refreshValues() {
    this.name = this.event.name;
    this.description = this.event.description;
    this.startDate = this.event.startDate;
    this.endDate = this.event.endDate;
    this.dates = this.event.getEventDates();
    this.resultGroups = this.event.getResultGroups();
    this.sortedResultGroups = this.resultGroups.slice();
  }

  applyFilter(filterValue: string) {
    this.sortedResultGroups = [];

    for (const resultGroup of this.resultGroups) {
      if (resultGroup.name.toLowerCase().includes(filterValue.toLowerCase())) {
        this.sortedResultGroups.push(resultGroup);
      } else {
        for (const resultSubgroup of resultGroup.getResultSubgroups()) {
          if (resultSubgroup.name.toLowerCase().includes(filterValue.toLowerCase())) {
            this.sortedResultGroups.push(resultGroup);
            break;
          }
        }
      }
    }
  }

  trackByFn(inde, item) {
    return item.id;
  }
}
