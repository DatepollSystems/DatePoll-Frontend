import {Component, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {BroadcastsAdministrationService} from '../broadcasts-administration.service';

import {Broadcast, UserBroadcastInfo} from '../../models/broadcast.model';
import {UIHelper} from '../../../../utils/helper/UIHelper';

@Component({
  selector: 'app-broadcast-admin-info',
  templateUrl: './broadcast-admin-info.component.html',
  styleUrls: ['./broadcast-admin-info.component.css'],
})
export class BroadcastAdminInfoComponent implements OnDestroy {
  displayedColumns: string[] = ['userName', 'sent', 'queuedAt', 'sentAt'];
  filterValue: string = null;
  dataSource: MatTableDataSource<UserBroadcastInfo>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  broadcast: Broadcast;
  broadcastSubscription: Subscription;

  loaded = false;

  constructor(private route: ActivatedRoute, private broadcastSerivce: BroadcastsAdministrationService) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id != null) {
        console.log('Broadcast to open: ' + id);

        this.broadcast = new Broadcast(Number(id), 'Loading', UIHelper.getCurrentDate(), 'Loading', 'Loading');

        this.broadcast = this.broadcastSerivce.getSentReceiptBroadcast(Number(id));
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.sort = this.sort;
        this.broadcastSubscription = this.broadcastSerivce.broadcastChange.subscribe((value) => {
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

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }
}
