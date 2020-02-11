import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Subscription} from 'rxjs';

import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';

import {EventsService} from '../events.service';
import {Permissions} from '../../../permissions';
import {MyUserService} from '../../my-user.service';

import {Event} from '../models/event.model';
import {EventResultGroup} from '../models/event-result-group.model';
import {EventDate} from '../models/event-date.model';

@Component({
  selector: 'app-event-info-modal',
  templateUrl: './event-info-modal.component.html',
  styleUrls: ['./event-info-modal.component.css']
})
export class EventInfoModalComponent implements OnDestroy {
  sendingRequest = true;

  eventSubscription: Subscription;
  event: Event;
  id: number;

  name: string;
  description: string;

  startDate: Date;
  endDate: Date;
  dates: EventDate[] = [];

  resultGroups: EventResultGroup[];
  sortedResultGroups: EventResultGroup[];
  searchValue = '';

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  public pieChartOptions: ChartOptions = {
    responsive: true
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartIsEmpty: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private eventsService: EventsService, myUserService: MyUserService) {
    this.myUserService = myUserService;

    this.event = data.event;
    const id = this.event.id;
    this.refreshValues();

    this.event = this.eventsService.getEvent(id);
    this.eventSubscription = this.eventsService.eventChange.subscribe(value => {
      this.event = value;
      this.refreshValues();
      this.sendingRequest = false;
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  refreshValues() {
    this.name = this.event.name;
    this.description = this.event.description;
    this.startDate = this.event.startDate;
    this.endDate = this.event.endDate;
    this.dates = this.event.getEventDates();
    this.resultGroups = this.event.getResultGroups();
    this.sortedResultGroups = this.resultGroups.slice();
    this.pieChartLabels = this.event.getDecisionsAsStrings();
    this.pieChartData = [...this.event.getChartData()];
    this.pieChartIsEmpty = this.event.chartIsEmpty;
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  applyFilter(filterValue: string) {
    this.sortedResultGroups = [];

    for (const resultGroup of this.resultGroups) {
      if (resultGroup.name.toLowerCase().includes(filterValue.toLowerCase())) {
        this.sortedResultGroups.push(resultGroup);
      } else {
        for (const resultSubgroup of resultGroup.getResultSubgroups()) {
          if (resultSubgroup.name.toLowerCase().includes(filterValue.toLowerCase())) {
            this.sortedResultGroups.push(resultGroup);
            break;
          }
        }
      }
    }
  }

  trackByFn(inde, item) {
    return item.id;
  }
}
