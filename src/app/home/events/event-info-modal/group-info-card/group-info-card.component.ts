import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';

import {MyUserService} from '../../../my-user.service';
import {Permissions} from '../../../../permissions';

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

  resultSubgroup: EventResultSubgroup[] = [];
  sortedResultSubgroup: EventResultSubgroup[] = [];

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  constructor(myUserService: MyUserService) {
    this.myUserService = myUserService;
  }

  ngOnInit() {
    this.resultSubgroup = this.resultGroup.getResultSubgroups();
    this.sortedResultSubgroup = this.resultSubgroup.slice();

    this.pieChartLabels = this.resultGroup.event.getDecisionsAsStrings();
    this.pieChartData = this.resultGroup.getChartData();
    this.pieChartIsEmpty = this.resultGroup.chartIsEmpty;
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
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

  trackByFn(inde, item) {
    return item.id;
  }
}
