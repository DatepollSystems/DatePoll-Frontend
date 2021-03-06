import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {BroadcastsService} from '../broadcasts.service';

import {Broadcast} from '../models/broadcast.model';
import {UIHelper} from '../../../utils/helper/UIHelper';

@Component({
  selector: 'app-broadcast-info',
  templateUrl: './broadcast-info.component.html',
  styleUrls: ['./broadcast-info.component.css'],
})
export class BroadcastInfoComponent implements OnDestroy {
  broadcast: Broadcast;
  broadcastSubscription: Subscription;
  loaded = false;

  constructor(private route: ActivatedRoute, private broadcastsService: BroadcastsService, private router: Router) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        if (isNaN(Number(id))) {
          console.log('Broadcast id not integer');
          this.router.navigate(['/home']);
          return;
        }

        console.log('Broadcast to open: ' + id);

        const broadcast = window.history.state;
        console.log(broadcast);
        if (broadcast?.subject) {
          this.broadcast = new Broadcast(Number(id), broadcast.subject, new Date(broadcast.sent), broadcast.body, broadcast.writerName);
        } else {
          this.broadcast = new Broadcast(-1, '~', UIHelper.getCurrentDate(), '~', '~');
        }

        this.broadcast = this.broadcastsService.getBroadcast(Number(id));
        if (this.broadcast?.id === Number(id)) {
          this.loaded = true;
        }
        this.broadcastSubscription = this.broadcastsService.broadcastChange.subscribe((value) => {
          this.broadcast = value;
          this.loaded = true;
        });
      } else {
        console.log('No broadcast to open');
      }
    });
  }

  ngOnDestroy(): void {
    this.broadcastSubscription.unsubscribe();
  }
}
