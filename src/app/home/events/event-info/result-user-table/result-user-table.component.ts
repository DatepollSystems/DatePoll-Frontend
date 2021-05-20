import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

import {EventDecision} from '../../models/event-decision.model';
import {EventResultUser} from '../../models/event-result-user.model';

@Component({
  selector: 'app-result-user-table',
  templateUrl: './result-user-table.component.html',
  styleUrls: ['./result-user-table.component.css'],
})
export class ResultUserTableComponent implements AfterViewInit {
  @Input()
  decisions: EventDecision[];

  @Input()
  resultUsers: EventResultUser[];

  // Table with user data
  displayedColumns: string[] = ['firstname', 'surname', 'decision'];
  filterValue: string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  constructor() {
    this.refreshTable();
  }

  ngAfterViewInit() {
    this.refreshTable();
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.resultUsers);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
