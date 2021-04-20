import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../../../management/groups-management/groups.service';
import {EventsService} from '../../events.service';
import {StandardDecisionsService} from '../../standardDecisions.service';

import {GroupAndSubgroupModel, GroupType} from '../../../../utils/models/groupAndSubgroup.model';
import {Decision} from '../../models/decision.model';
import {EventDate} from '../../models/event-date.model';
import {Event} from '../../models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnDestroy {
  startDate: Date;
  endDate: Date;

  allMembers = false;
  groupsSubscription: Subscription;
  joined: GroupAndSubgroupModel[] = [];
  free: GroupAndSubgroupModel[] = [];

  decisions: Decision[] = [];
  standardDecisionsSubscription: Subscription;

  dates: EventDate[] = [];

  constructor(
    private groupsService: GroupsService,
    private router: Router,
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

    this.standardDecisionsSubscription = standardDecisionsService.standardDecisionsChange.subscribe((value) => {
      this.decisions = [];
      let y = -1;
      for (const decisionO of value) {
        const decision = new Decision(y, decisionO.decision, decisionO.color);
        decision.showInCalendar = decisionO.showInCalendar;
        this.decisions.push(decision);
        y--;
      }
    });

    this.free = this.groupsService.getGroupsAndSubgroups();
    this.joined = [];
    this.groupsSubscription = this.groupsService.groupsAndSubgroupsChange.subscribe((value) => {
      this.free = value;
      this.joined = [];
    });
  }

  public ngOnDestroy(): void {
    this.standardDecisionsSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
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

  allMembersChanged(checked: boolean) {
    this.allMembers = checked;
  }

  create(form: NgForm) {
    if (this.dates.length === 0) {
      this.notificationsService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_DATE_LIST_REQUIRED')
      );
      return;
    }

    if (this.joined.length === 0 && !this.allMembers) {
      console.log('Groups length 0! - ' + this.joined.length + ' And allMembers - ' + this.allMembers);
      this.notificationsService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_NO_GROUPS_AND_NOT_ALL_MEMBERS')
      );
      return;
    }

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    this.router.navigateByUrl('/home/events/administration');

    const event = new Event(0, name, new Date(), new Date(), this.allMembers, description, this.decisions, this.dates);
    console.log(event);
    this.eventsService.createEvent(event).subscribe(
      (response: any) => {
        console.log(response);
        this.eventsService.fetchEvents();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_SUCCESSFULLY_CREATED')
        );

        const id = response.event.id;

        if (this.joined.length > 0) {
          console.log('create Event | Adding groups and subgroups to event');

          for (const group of this.joined) {
            if (group.type === GroupType.PARENTGROUP) {
              this.eventsService.addGroupToEvent(id, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                (error) => console.log(error)
              );
            } else {
              this.eventsService.addSubgroupToEvent(id, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                (error) => console.log(error)
              );
            }
          }
        }
      },
      (error) => console.log(error)
    );
  }
}
