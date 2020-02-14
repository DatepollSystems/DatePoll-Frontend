import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {EventsService} from '../../events.service';
import {Decision} from '../../models/decision.model';
import {EventResultUser} from '../../models/event-result-user.model';

@Component({
  selector: 'app-result-user-bar-chart',
  templateUrl: './result-user-bar-chart.component.html',
  styleUrls: ['./result-user-bar-chart.component.css']
})
export class ResultUserBarChartComponent implements OnDestroy {
  @Input()
  decisions: Decision[];

  @Input()
  resultUsers: EventResultUser[];

  @Input()
  inAccordion = false;

  resultBarElements: any[] = null;

  public minOneVoting = false;

  colors = ['#2196F3', '#FF9800', '#FFEB3B', '#00BCD4', '#F44336', '#009688', '#4CAF50', '#673AB7', '#CDDC39', '#607D8B', '#E91E63'];

  private eventSubscription: Subscription;

  constructor(private eventsService: EventsService) {
    this.eventSubscription = this.eventsService.eventChange.subscribe(value => {
      setTimeout(() => {
        this.calculateResultBarElements();
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  getResultBarElements(): any[] {
    if (this.resultBarElements === null) {
      this.calculateResultBarElements();
    }
    return this.resultBarElements;
  }

  calculateResultBarElements() {
    const objects = [];

    for (const decision of this.decisions) {
      const object = {
        id: decision.id,
        name: decision.decision,
        count: 0
      };
      objects.push(object);
    }

    let votedUsersCount = 0;
    for (const resultUser of this.resultUsers) {
      for (const object of objects) {
        if (resultUser.decisionId === object.id) {
          object.count += 1;
          votedUsersCount++;
          this.minOneVoting = true;
          break;
        }
      }
    }

    const resultBarElements = [];

    let counter = 0;
    for (const object of objects) {
      let percent = Math.round((object.count / votedUsersCount) * 100);

      const percentWidth = Math.round((object.count / votedUsersCount) * 95);

      if (counter >= 9) {
        counter = 0;
      }

      const color = this.colors[counter];
      counter++;

      if (percent.toString().includes('NaN')) {
        percent = 0;
      }

      resultBarElements.push({
        name: object.name,
        percent,
        percentWidth,
        count: object.count,
        color
      });
    }
    this.resultBarElements = resultBarElements;
  }
}
