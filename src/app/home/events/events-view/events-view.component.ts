import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatSlideToggleChange} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {EventsUserService} from '../events-user.service';

import {EventInfoModalComponent} from '../event-info-modal/event-info-modal.component';

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

  constructor(private eventsUserSerivce: EventsUserService, private dialog: MatDialog, private route: ActivatedRoute) {
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

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id != null) {
        console.log('Event to open: ' + id);

        const event = new Event(Number(id), 'Loading', new Date(), new Date(), false, 'Loading', [], []);

        this.dialog.open(EventInfoModalComponent, {
          width: '80vh',
          data: {
            event: event
          }
        });
      } else {
        console.log('No event to open');
      }
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
