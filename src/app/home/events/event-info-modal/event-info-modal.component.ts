import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Subscription} from 'rxjs';

import {EventsService} from '../events.service';
import {Event} from '../models/event.model';
import {EventResultGroup} from '../models/event-result-group.model';
import {ChartType, ChartOptions} from 'chart.js';
import {Label, SingleDataSet, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend} from 'ng2-charts';

@Component({
  selector: 'app-event-info-modal',
  templateUrl: './event-info-modal.component.html',
  styleUrls: ['./event-info-modal.component.css']
})
export class EventInfoModalComponent implements OnDestroy {
  sendingRequest = false;

  eventSubscription: Subscription;
  event: Event;
  id: number;

  name: string;
  description: string;

  startDate: Date;
  startDateHours: number;
  startDateMinutes: number;
  endDate: Date;
  endDateHours: number;
  endDateMinutes: number;

  resultGroups: EventResultGroup[];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private eventsService: EventsService) {
    this.sendingRequest = true;

    this.event = data.event;
    const id = this.event.id;
    this.refreshValues();

    this.event = this.eventsService.getEvent(id);
    this.eventSubscription = this.eventsService.eventChange.subscribe((value) => {
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
    this.startDateHours = this.startDate.getHours();
    this.startDateMinutes = this.startDate.getMinutes();
    this.endDate = this.event.endDate;
    this.endDateHours = this.endDate.getHours();
    this.endDateMinutes = this.endDate.getMinutes();
    this.resultGroups = this.event.getResultGroups();
    this.pieChartLabels = this.event.getDecisions();
    this.pieChartData = [... this.event.getChartData()];
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
}
