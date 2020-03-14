import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../../../management/groups-management/groups.service';
import {Group} from '../../../management/groups-management/models/group.model';
import {EventsService} from '../../events.service';
import {StandardDecisionsService} from '../../standardDecisions.service';

import {Decision} from '../../models/decision.model';
import {EventDate} from '../../models/event-date.model';
import {Event} from '../../models/event.model';

@Component({
  selector: 'app-event-create-modal',
  templateUrl: './event-create-modal.component.html',
  styleUrls: ['./event-create-modal.component.css']
})
export class EventCreateModalComponent implements OnDestroy {
  @ViewChild('successfullyCreatedEvent', {static: true}) successfullyCreatedEvent: TemplateRef<any>;

  startDate: Date;
  endDate: Date;

  groups: Group[] = [];
  groupsSubscription: Subscription;

  joined: any[] = [];
  free: any[] = [];

  decisions: Decision[] = [];
  standardDecisionsSubscription: Subscription;

  dates: EventDate[] = [];

  constructor(
    private groupsService: GroupsService,
    private dialogRef: MatDialogRef<EventCreateModalComponent>,
    private notificationsService: NotificationsService,
    private standardDecisionsService: StandardDecisionsService,
    private translate: TranslateService,
    private eventsService: EventsService
  ) {
    const standardDecisions = this.standardDecisionsService.getStandardDecisions();
    let i = -1;
    for (const standardDecision of standardDecisions) {
      const decision = new Decision(i, standardDecision.decision, standardDecision.color);
      decision.showInCalendar = standardDecision.showInCalendar;
      this.decisions.push(decision);
      i--;
    }

    this.standardDecisionsSubscription = standardDecisionsService.standardDecisionsChange.subscribe(value => {
      this.decisions = [];
      let y = -1;
      for (const decisionO of value) {
        const decision = new Decision(y, decisionO.decision, decisionO.color);
        decision.showInCalendar = decisionO.showInCalendar;
        this.decisions.push(decision);
        y--;
      }
    });

    this.groups = this.groupsService.getGroups();
    this.remakeFreeAndJoinedList();
    this.groupsSubscription = this.groupsService.groupsChange.subscribe(value => {
      this.groups = value;
      this.remakeFreeAndJoinedList();
    });
  }

  public ngOnDestroy(): void {
    this.standardDecisionsSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
  }

  remakeFreeAndJoinedList() {
    this.free = [];
    this.joined = [];

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];

      const groupObject = {
        id: group.id,
        name: group.name,
        type: 'parentgroup'
      };

      this.free.push(groupObject);

      for (let j = 0; j < group.getSubgroups().length; j++) {
        const subgroup = group.getSubgroups()[j];

        const subgroupObject = {
          id: subgroup.id,
          name: subgroup.name,
          type: 'subgroup',
          group_id: group.id,
          group_name: group.name
        };

        this.free.push(subgroupObject);
      }
    }

    setTimeout(function() {
      // Check if elements are not null because if the user close the modal before the timeout, there will be thrown an error
      if (document.getElementById('joined-list') != null && document.getElementById('free-list') != null) {
        document.getElementById('joined-list').style.height = document.getElementById('free-list').clientHeight.toString() + 'px';
        console.log('Free height:' + document.getElementById('free-list').clientHeight);
        console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
      }
    }, 1000);
  }

  onDecisionsChange(decisions: Decision[]) {
    this.decisions = decisions;
  }

  onFreeChange(free: any[]) {
    this.free = free;
  }

  onJoinedChange(joined: any[]) {
    this.joined = joined;
  }

  onEventDatesChange(eventDates: EventDate[]) {
    this.dates = eventDates;
  }

  create(form: NgForm) {
    if (this.dates.length === 0) {
      this.notificationsService.info('', this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_DATE_LIST_REQUIRED'));
      return;
    }

    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    const forEveryone = this.joined.length === 0;

    const event = new Event(0, name, new Date(), new Date(), forEveryone, description, this.decisions, this.dates);
    console.log(event);
    this.eventsService.createEvent(event).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsService.fetchEvents();
        this.notificationsService.html(this.successfullyCreatedEvent, NotificationType.Success, null, 'success');

        const id = response.event.id;

        if (this.joined.length > 0) {
          console.log('create Event | Adding groups and subgroups to event');

          for (let i = 0; i < this.joined.length; i++) {
            const group = this.joined[i];

            if (group.type.includes('parentgroup')) {
              this.eventsService.addGroupToEvent(id, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                error => console.log(error)
              );
            } else {
              this.eventsService.addSubgroupToEvent(id, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                error => console.log(error)
              );
            }
          }
        }
      },
      error => console.log(error)
    );
  }
}
