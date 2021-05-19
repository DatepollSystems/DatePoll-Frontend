import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BroadcastsService} from '../broadcasts.service';
import {Broadcast} from '../models/broadcast.model';

@Component({
  selector: 'app-broadcasts-view',
  templateUrl: './broadcasts-view.component.html',
  styleUrls: ['./broadcasts-view.component.css'],
})
export class BroadcastsViewComponent implements OnDestroy {
  broadcasts: Broadcast[] = [];
  broadcastsCopy: Broadcast[] = [];
  broadcastsSubscription: Subscription;
  broadcastsSearchedSubscription: Subscription;
  empty = false;

  searchFilter = '';

  page = 1;

  constructor(private broadcastsService: BroadcastsService, private router: Router) {
    this.broadcasts = broadcastsService.getBroadcasts(0);
    this.broadcastsCopy = this.broadcasts.slice();
    this.broadcastsSubscription = broadcastsService.broadcastsChange.subscribe((value) => {
      if (value.length === 0) {
        this.page--;
        return;
      }

      this.broadcasts = this.broadcasts.concat(value);
      this.broadcastsCopy = this.broadcasts.slice();
      if (this.broadcasts.length === 0) {
        this.empty = true;
      }
    });
    this.broadcastsSearchedSubscription = broadcastsService.broadcastsSearchedChange.subscribe((value) => {
      this.broadcastsCopy = value;
    });
  }

  ngOnDestroy(): void {
    this.broadcastsSubscription.unsubscribe();
  }

  routeTo(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/' + broadcast.id, {state: broadcast});
  }

  searchFilterUpdate(event) {
    if (!this.searchFilter || this.searchFilter?.length < 1) {
      this.broadcastsCopy = this.broadcasts.slice();
      return;
    }
    this.broadcastsService.searchBroadcast(this.searchFilter);
  }

  onScrollDown() {
    if (this.searchFilter || this.searchFilter?.length > 0) {
      return;
    }
    this.page++;
    this.broadcastsService.getBroadcasts(this.page);
  }
}
