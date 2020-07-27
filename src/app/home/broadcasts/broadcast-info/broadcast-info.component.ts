import {Location} from '@angular/common';
import {Component, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {BroadcastsService} from '../broadcasts.service';

import {Broadcast} from '../models/broadcast.model';

@Component({
  selector: 'app-broadcast-info',
  templateUrl: './broadcast-info.component.html',
  styleUrls: ['./broadcast-info.component.css']
})
export class BroadcastInfoComponent implements OnDestroy {
  broadcast: Broadcast;
  broadcastSubscription: Subscription;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private broadcastsService: BroadcastsService,
    private sanitizer: DomSanitizer
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id != null) {
        console.log('Broadcast to open: ' + id);

        const broadcast = window.history.state;
        console.log(broadcast);
        if (broadcast?.subject) {
          this.broadcast = new Broadcast(Number(id), broadcast.subject, new Date(broadcast.sent), broadcast.body, broadcast.writerName);
        } else {
          this.broadcast = new Broadcast(-1, '~', new Date(), '~', '~');
        }

        this.broadcast = this.broadcastsService.getBroadcast(Number(id));
        if (this.broadcast != null) {
          this.loaded = true;
        }
        this.broadcastSubscription = this.broadcastsService.broadcastChange.subscribe(value => {
          this.broadcast = value;
          this.loaded = true;
        });
      } else {
        console.log('No broadcast to open');
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getSanitizedContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnDestroy(): void {
    this.broadcastSubscription.unsubscribe();
  }
}
