import {Component, Input} from '@angular/core';
import {Decision} from '../../models/decision.model';
import {EventResultUser} from '../../models/event-result-user.model';

@Component({
  selector: 'app-result-user-bar-chart',
  templateUrl: './result-user-bar-chart.component.html',
  styleUrls: ['./result-user-bar-chart.component.css']
})
export class ResultUserBarChartComponent {
  @Input()
  decisions: Decision[];

  @Input()
  resultUsers: EventResultUser[];

  @Input()
  inAccordion = false;

  resultBarElements: any[] = null;

  colors = [
    '#F44336',
    '#E91E63',
    '#673AB7',
    '#2196F3',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#CDDC39',
    '#FFEB3B',
    '#FF9800',
    '#607D8B'
  ];

  constructor() {
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
        'id': decision.id,
        'name': decision.decision,
        'count': 0
      };
      objects.push(object);
    }

    let votedUsersCount = 0;
    for (const resultUser of this.resultUsers) {
      for (const object of objects) {
        if (resultUser.decisionId === object.id) {
          object.count += 1;
          votedUsersCount++;
          break;
        }
      }
    }

    let colorPerDecision = true;
    if (objects.length > this.colors.length) {
      colorPerDecision = false;
    }

    const resultBarElements = [];

    for (const object of objects) {
      if (object.count > 0) {
        const percent = Math.round((object.count / votedUsersCount) * 100);

        let percentWidth = Math.round((object.count / votedUsersCount) * 95);
        // if (this.inAccordion) {
        //   percentWidth =
        // } else {
        //   percentWidth = percent;
        // }

        let color;
        if (colorPerDecision) {
          let n = 0;

          while (n < 50) {
            color = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];

            let colorAlreadyUsed = false;
            for (const element of resultBarElements) {
              if (element.color === color) {
                colorAlreadyUsed = true;
                break;
              }
            }

            if (!colorAlreadyUsed) {
              break;
            }

            n++;
          }

        } else {
          color = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
        }

        resultBarElements.push({
          'name': object.name,
          'percent': percent,
          'percentWidth': percentWidth,
          'count': object.count,
          'color': color
        });
      }
    }
    this.resultBarElements = resultBarElements;
  }

}
