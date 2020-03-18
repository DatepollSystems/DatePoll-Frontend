import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatSlideToggleChange} from '@angular/material';
import {Subscription} from 'rxjs';

import {EventsUserService} from '../events-user.service';

import {IsMobileService} from '../../../services/is-mobile.service';
import {Event} from '../models/event.model';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnDestroy {
  @ViewChild('successfullyRemovedDecision', {static: true}) successfullyRemovedDecision: TemplateRef<any>;
  loading = true;
  showAllEvents = false;

  eventsToShow: Event[];
  events: Event[];
  eventsSubscription: Subscription;

  isMobile = true;
  isMobileSubscription: Subscription;

  constructor(private eventsUserSerivce: EventsUserService, private dialog: MatDialog, private isMobileService: IsMobileService) {
    this.events = this.eventsUserSerivce.getEvents();
    this.refreshView();
    if (this.events.length > 0) {
      this.loading = false;
    }
    this.eventsSubscription = this.eventsUserSerivce.eventsChange.subscribe(value => {
      this.events = value;
      this.loading = false;
      this.refreshView();
    });

    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe(value => {
      this.isMobile = value;
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  refreshView() {
    if (this.showAllEvents) {
      this.eventsToShow = this.events.slice();
    } else {
      this.eventsToShow = [];
      for (let i = 0; i < this.events.length; i++) {
        if (!this.events[i].alreadyVotedFor) {
          this.eventsToShow.push(this.events.slice()[i]);
        }
      }
    }
  }

  onShowAllEventsChange(event: MatSlideToggleChange) {
    this.refreshView();
  }
}
