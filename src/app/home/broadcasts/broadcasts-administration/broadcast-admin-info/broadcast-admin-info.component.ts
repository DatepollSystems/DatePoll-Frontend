import {Component, OnDestroy, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Subscription} from 'rxjs';

import {BroadcastsAdministrationService} from '../broadcasts-administration.service';

import {Broadcast, UserBroadcastInfo} from '../../models/broadcast.model';

@Component({
  selector: 'app-broadcast-admin-info',
  templateUrl: './broadcast-admin-info.component.html',
  styleUrls: ['./broadcast-admin-info.component.css']
})
export class BroadcastAdminInfoComponent implements OnDestroy {
  displayedColumns: string[] = ['userName', 'sent', 'queuedAt', 'sentAt'];
  filterValue: string = null;
  dataSource: MatTableDataSource<UserBroadcastInfo>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  broadcast: Broadcast;
  broadcastSubscription: Subscription;

  loaded = false;

  constructor(private route: ActivatedRoute, private broadcastSerivce: BroadcastsAdministrationService, private sanitizer: DomSanitizer) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id != null) {
        console.log('Broadcast to open: ' + id);

        const localBroadcast = window.history.state;
        console.log(localBroadcast);
        if (localBroadcast != null) {
          if (localBroadcast?.subject) {
            this.broadcast = new Broadcast(
              Number(id),
              localBroadcast.subject,
              localBroadcast.sent,
              localBroadcast.body,
              localBroadcast.writerName
            );
          } else {
            this.broadcast = new Broadcast(Number(id), 'Loading', new Date(), 'Loading', 'Loading');
          }
        }

        this.broadcast = this.broadcastSerivce.getSentReceiptBroadcast(Number(id));
        this.broadcastSubscription = this.broadcastSerivce.broadcastChange.subscribe(value => {
          this.broadcast = value;
          this.loaded = true;
          this.dataSource = new MatTableDataSource(this.broadcast.userInfos);
          this.dataSource.sort = this.sort;
        });
      } else {
        console.log('No broadcast to open');
      }
    });
  }

  ngOnDestroy(): void {
    this.broadcastSubscription.unsubscribe();
  }

  getSanitizedContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }
}