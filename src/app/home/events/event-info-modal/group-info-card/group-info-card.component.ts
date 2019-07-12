import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';

import {EventResultGroup} from '../../models/event-result-group.model';
import {EventResultSubgroup} from '../../models/event-result-subgroup.model';

@Component({
  selector: 'app-group-info-card',
  templateUrl: './group-info-card.component.html',
  styleUrls: ['./group-info-card.component.css']
})
export class GroupInfoCardComponent implements OnInit, OnChanges {
  @Input()
  resultGroup: EventResultGroup;

  @Input()
  searchValue = '';

  // Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartIsEmpty: boolean;

  // Table with user data
  displayedColumns: string[] = ['firstname', 'surname', 'decision'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  resultSubgroup: EventResultSubgroup[] = [];
  sortedResultSubgroup: EventResultSubgroup[] = [];

  constructor() {
  }

  ngOnInit() {
    this.resultSubgroup = this.resultGroup.getResultSubgroups();
    this.sortedResultSubgroup = this.resultSubgroup.slice();

    this.pieChartLabels = this.resultGroup.event.getDecisions();
    this.pieChartData = this.resultGroup.getChartData();
    this.pieChartIsEmpty = this.resultGroup.chartIsEmpty;
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();

    this.dataSource = new MatTableDataSource(this.resultGroup.getResultUsers());
    setTimeout(() => {
      if (this.dataSource != null) {
        this.dataSource.sort = this.sort;
      }
    }, 1000);
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

  ngOnChanges(): void {
    if (this.searchValue.length === 0 || this.resultGroup.name.toLowerCase().includes(this.searchValue.toLowerCase())) {
      this.sortedResultSubgroup = this.resultSubgroup.slice();
    } else {
      this.sortedResultSubgroup = [];

      for (const resultSubgroup of this.resultGroup.getResultSubgroups()) {
        if (resultSubgroup.name.toLowerCase().includes(this.searchValue.toLowerCase())) {
          this.sortedResultSubgroup.push(resultSubgroup);
          break;
        }
      }
    }
  }

  getVotesSummary() {
    const objects = [];

    for (const decision of this.resultGroup.event.getDecisions()) {
      const object = {
        'name': decision,
        'count': 0
      };
      objects.push(object);
    }

    for (const resultUser of this.resultGroup.getResultUsers()) {
      for (const object of objects) {
        if (resultUser.decision === object.name) {
          object.count += 1;
          break;
        }
      }
    }

    let stringToReturn = '';
    for (const object of objects) {
      stringToReturn += object.name + ': ' + object.count + ' ';
    }
    return stringToReturn;
  }

}
