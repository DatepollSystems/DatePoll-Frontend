import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';

import {EventResultGroup} from '../../models/event-result-group.model';

@Component({
  selector: 'app-group-info-card',
  templateUrl: './group-info-card.component.html',
  styleUrls: ['./group-info-card.component.css']
})
export class GroupInfoCardComponent implements OnInit {
  @Input()
  resultGroup: EventResultGroup;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartIsEmpty: boolean;

  displayedColumns: string[] = ['firstname', 'surname', 'decision'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  constructor() {
  }

  ngOnInit() {
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

}
