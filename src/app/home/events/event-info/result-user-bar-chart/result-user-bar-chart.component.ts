import {Component, Input, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-result-user-bar-chart',
  templateUrl: './result-user-bar-chart.component.html',
  styleUrls: ['./result-user-bar-chart.component.css'],
})
export class ResultUserBarChartComponent implements OnDestroy {
  @Input()
  chart: any[] = null;

  constructor() {}

  ngOnDestroy(): void {}
}
