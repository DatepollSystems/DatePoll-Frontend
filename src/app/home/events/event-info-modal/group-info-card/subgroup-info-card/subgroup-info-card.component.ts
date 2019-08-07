import {Component, Input, OnInit} from '@angular/core';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';

import {EventResultSubgroup} from '../../../models/event-result-subgroup.model';

@Component({
  selector: 'app-subgroup-info-card',
  templateUrl: './subgroup-info-card.component.html',
  styleUrls: ['./subgroup-info-card.component.css']
})
export class SubgroupInfoCardComponent implements OnInit {
  @Input()
  resultSubgroup: EventResultSubgroup;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartIsEmpty: boolean;

  constructor() {
  }

  ngOnInit() {
    this.pieChartLabels = this.resultSubgroup.event.getDecisionsAsStrings();
    this.pieChartData = [...this.resultSubgroup.getChartData()];
    this.pieChartIsEmpty = this.resultSubgroup.chartIsEmpty;
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

}
