import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Subscription} from 'rxjs';

import {BroadcastsAdministrationService} from './broadcasts-administration.service';

import {Broadcast} from '../models/broadcast.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-broadcasts-administration',
  templateUrl: './broadcasts-administration.component.html',
  styleUrls: ['./broadcasts-administration.component.css']
})
export class BroadcastsAdministrationComponent implements OnDestroy {
  displayedColumns: string[] = ['subject', 'date', 'writer', 'body', 'action'];
  filterValue: string = null;
  dataSource: MatTableDataSource<Broadcast>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  broadcasts: Broadcast[] = [];
  broadcastsSubscription: Subscription;

  loading = true;

  constructor(private broadcastsService: BroadcastsAdministrationService, private router: Router) {
    this.broadcasts = this.broadcastsService.getBroadcasts();
    if (this.broadcasts.length !== 0) {
      this.loading = false;
    }
    this.dataSource = new MatTableDataSource(this.broadcasts);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.broadcastsSubscription = this.broadcastsService.broadcastsChange.subscribe(value => {
      this.broadcasts = value;
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.broadcasts);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    this.broadcastsSubscription.unsubscribe();
  }

  refresh() {
    this.loading = true;
    this.broadcastsService.fetchBroadcasts();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openBroadcastAdminInfo(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/administration/' + broadcast.id, {state: broadcast});
  }
}
