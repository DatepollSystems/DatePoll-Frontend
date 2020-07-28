import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BroadcastsService} from '../broadcasts.service';
import {Broadcast} from '../models/broadcast.model';

@Component({
  selector: 'app-broadcasts-view',
  templateUrl: './broadcasts-view.component.html',
  styleUrls: ['./broadcasts-view.component.css']
})
export class BroadcastsViewComponent implements OnDestroy {
  broadcasts: Broadcast[] = [];
  broadcastsCopy: Broadcast[] = [];
  broadcastsSubscription: Subscription;
  empty = false;

  searchFilter = '';

  constructor(private broadcastsService: BroadcastsService, private router: Router) {
    this.broadcasts = broadcastsService.getBroadcasts();
    this.broadcastsCopy = this.broadcasts.slice();
    this.broadcastsSubscription = broadcastsService.broadcastsChange.subscribe(value => {
      this.broadcasts = value;
      this.broadcastsCopy = this.broadcasts.slice();
      if (this.broadcasts.length === 0) {
        this.empty = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.broadcastsSubscription.unsubscribe();
  }

  routeTo(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/' + broadcast.id, {state: broadcast});
  }

  searchFilterUpdate(event) {
    this.broadcastsCopy = [];
    for (const broadcast of this.broadcasts) {
      if (
        broadcast.subject.toLocaleLowerCase().includes(this.searchFilter.toLocaleLowerCase()) ||
        broadcast.writerName.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        broadcast.body.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        broadcast.sent.toString().includes(this.searchFilter.toLowerCase())
      ) {
        this.broadcastsCopy.push(broadcast);
      }
    }
  }
}
