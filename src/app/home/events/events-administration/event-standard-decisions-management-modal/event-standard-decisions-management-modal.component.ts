import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {StandardDecisionsService} from '../../standardDecisions.service';

import {EventStandardDecision} from '../../models/standardDecision.model';

@Component({
  selector: 'app-event-standard-decisions-management-modal',
  templateUrl: './event-standard-decisions-management-modal.component.html',
  styleUrls: ['./event-standard-decisions-management-modal.component.css']
})
export class EventStandardDecisionsManagementModalComponent implements OnDestroy {
  loadingStandardDecisions = true;

  standardDecisions: EventStandardDecision[];
  standardDecisionsSubscription: Subscription;

  showInCalendar = false;
  color: string;

  constructor(
    private standardDecisionsService: StandardDecisionsService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.standardDecisions = standardDecisionsService.getStandardDecisions();

    if (this.standardDecisions.length < 1) {
      this.loadingStandardDecisions = true;
    }

    this.standardDecisionsSubscription = standardDecisionsService.standardDecisionsChange.subscribe(value => {
      this.standardDecisions = value;
      this.loadingStandardDecisions = false;
    });
  }

  ngOnDestroy() {
    this.standardDecisionsSubscription.unsubscribe();
  }

  changeColor(color: string) {
    this.color = color;
  }

  showInCalendarChange(e) {
    this.showInCalendar = e.checked;
  }

  addStandardDecision(form: NgForm) {
    if (this.color == null) {
      this.notificationsService.warn(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_COLOR_REQUIRED')
      );
      return;
    }

    const decision = form.controls.decision.value;

    this.standardDecisionsService.addStandardDecision(decision, this.showInCalendar, this.color).subscribe(
      (response: any) => {
        console.log(response);
        this.standardDecisionsService.fetchStandardDecisions();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('EVENTS_STANDARD_DECISIONS_MANAGEMENT_SUCCESSFULLY_ADDED')
        );
      },
      error => console.log(error)
    );

    form.reset();
    this.showInCalendar = false;
  }

  removeStandardDecision(id: number, button: any) {
    button.disabled = true;

    this.standardDecisionsService.removeStandardDecision(id).subscribe(
      (response: any) => {
        console.log(response);
        this.standardDecisionsService.fetchStandardDecisions();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('EVENTS_STANDARD_DECISIONS_MANAGEMENT_SUCCESSFULLY_REMOVED')
        );
      },
      error => console.log(error)
    );
  }
}
