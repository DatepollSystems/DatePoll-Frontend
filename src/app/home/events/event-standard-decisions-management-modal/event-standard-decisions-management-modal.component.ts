import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {EventStandardDecision} from '../models/standardDecision.model';
import {Subscription} from 'rxjs';
import {StandardDecisionsService} from '../standardDecisions.service';
import {NgForm} from '@angular/forms';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-event-standard-decisions-management-modal',
  templateUrl: './event-standard-decisions-management-modal.component.html',
  styleUrls: ['./event-standard-decisions-management-modal.component.css']
})
export class EventStandardDecisionsManagementModalComponent implements OnDestroy {
  @ViewChild('successfullyAddedStandardDecision', {static: true}) successfullyAddedStandardDecision: TemplateRef<any>;
  @ViewChild('successfullyRemovedStandardDecision', {static: true}) successfullyRemovedStandardDecision: TemplateRef<any>;

  loadingStandardDecisions = true;

  standardDecisions: EventStandardDecision[];
  standardDecisionsSubscription: Subscription;

  constructor(private standardDecisionsService: StandardDecisionsService, private notificationsService: NotificationsService) {
    this.standardDecisions = standardDecisionsService.getStandardDecisions();

    if (this.standardDecisions.length < 1) {
      this.loadingStandardDecisions = true;
    }

    this.standardDecisionsSubscription = standardDecisionsService.standardDecisionsChange.subscribe((value) => {
      this.standardDecisions = value;
      this.loadingStandardDecisions = false;
    });
  }

  ngOnDestroy() {
    this.standardDecisionsSubscription.unsubscribe();
  }

  addStandardDecision(form: NgForm) {
    const decision = form.controls.decision.value;

    this.standardDecisionsService.addStandardDecision(decision).subscribe(
      (response: any) => {
        console.log(response);
        this.standardDecisionsService.fetchStandardDecisions();
        this.notificationsService.html(this.successfullyAddedStandardDecision, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );

    form.reset();
  }

  removeStandardDecision(id: number, button: any) {
    button.disabled = true;

    this.standardDecisionsService.removeStandardDecision(id).subscribe(
      (response: any) => {
        console.log(response);
        this.standardDecisionsService.fetchStandardDecisions();
        this.notificationsService.html(this.successfullyRemovedStandardDecision, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }
}
