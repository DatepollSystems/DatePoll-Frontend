import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Event} from '../../models/event.model';

@Component({
  selector: 'app-event-info-view',
  templateUrl: './event-info-view.component.html',
  styleUrls: ['./event-info-view.component.css']
})
export class EventInfoViewComponent {
  event: Event;
  objectLoaded = false;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id != null) {
        console.log('Event to open: ' + id);

        const localEvent = window.history.state;
        console.log(localEvent);
        if (localEvent != null) {
          if (localEvent?.name) {
            this.event = new Event(Number(id), localEvent.subject, new Date(), new Date(), false, 'Loading', [], []);
            return;
          }
          this.event = new Event(Number(id), 'Loading', new Date(), new Date(), false, 'Loading', [], []);
        }
      } else {
        console.log('No event to open');
      }
    });
  }

  eventLoaded(event: Event) {
    this.event = event;
    this.objectLoaded = true;
  }
}
