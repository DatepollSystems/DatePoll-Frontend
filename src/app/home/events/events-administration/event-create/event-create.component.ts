import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {GroupsService} from '../../../management/groups-management/groups.service';
import {EventsService} from '../../services/events.service';
import {StandardDecisionsService} from '../../services/standardDecisions.service';
import {EventsCreateUpdateService} from '../../services/eventsCreateUpdate.service';
import {UIHelper} from '../../../../utils/helper/UIHelper';

import {
  GroupAndSubgroupModel,
  GroupType,
} from '../../../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';
import {EventDecision} from '../../models/event-decision.model';
import {EventDate} from '../../models/event-date.model';
import {Event} from '../../models/event.model';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EventCreateComponent implements OnDestroy {
  allMembers = false;
  groupsSubscription: Subscription;
  joined: GroupAndSubgroupModel[] = [];
  free: GroupAndSubgroupModel[] = [];

  decisions: EventDecision[] = [];
  standardDecisionsSubscription: Subscription;

  dates: EventDate[] = [];

  xWeeks = 1;
  xRepeats: number;
  repeats: any[] = [];
  showCalendar = true;

  constructor(
    private groupsService: GroupsService,
    private router: Router,
    private notificationService: NotificationService,
    private standardDecisionsService: StandardDecisionsService,
    private eventsService: EventsService,
    private eventsCreateUpdateService: EventsCreateUpdateService
  ) {
    const standardDecisions = this.standardDecisionsService.getStandardDecisions();
    let i = -1;
    for (const standardDecision of standardDecisions) {
      this.decisions.push(new EventDecision(i, standardDecision.decision, standardDecision.color, standardDecision.showInCalendar));
      i--;
    }

    this.standardDecisionsSubscription = standardDecisionsService.standardDecisionsChange.subscribe((value) => {
      this.decisions = [];
      let y = -1;
      for (const decisionO of value) {
        this.decisions.push(new EventDecision(y, decisionO.decision, decisionO.color, decisionO.showInCalendar));
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

  onDecisionsChange(decisions: EventDecision[]) {
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

  addRepeating(form: NgForm) {
    if (this.dates.length === 0) {
      this.notificationService.info('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_DATE_LIST_REQUIRED');
      return;
    }
    console.log(this.dates);
    console.log('xWeeks:' + this.xWeeks);
    console.log('xRepeats:' + this.xRepeats);
    for (let i = 1; i <= this.xRepeats; i++) {
      const currentDates = [];
      for (const cDate of this.dates.slice()) {
        const date = new Date(cDate.date);
        date.setDate(date.getDate() + i * this.xWeeks * 7);
        currentDates.push(new EventDate(cDate.id, cDate.location, cDate.x, cDate.y, date, cDate.description));
      }
      this.repeats.push({
        xRepeats: i,
        dates: currentDates,
      });
    }
    form.reset();
    this.reloadCalendar();
  }

  deleteRepeats(repeat) {
    const i = this.repeats.indexOf(repeat);
    if (i > -1) {
      this.repeats.splice(i, 1);
    }
    this.reloadCalendar();
  }

  private reloadCalendar() {
    this.showCalendar = false;
    setTimeout(() => {
      this.showCalendar = true;
    }, 1);
  }

  isSelected: MatCalendarCellClassFunction<Date> = (event, view) => {
    for (const repeat of this.repeats) {
      for (const date of repeat.dates) {
        if (
          date.date.getFullYear() === event.getFullYear() &&
          date.date.getMonth() === event.getMonth() &&
          date.date.getDate() === event.getDate()
        ) {
          return 'selected';
        }
      }
    }

    return '';
  };

  create(form: NgForm) {
    if (this.dates.length === 0) {
      this.notificationService.info('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_DATE_LIST_REQUIRED');
      return;
    }

    if (this.joined.length === 0 && !this.allMembers) {
      console.log('Groups length 0! - ' + this.joined.length + ' And allMembers - ' + this.allMembers);
      this.notificationService.info('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_NO_GROUPS_AND_NOT_ALL_MEMBERS');
      return;
    }

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const currentDate = UIHelper.getCurrentDate();

    this.router.navigateByUrl('/home/events/administration');

    const eventsToCreate = [];
    eventsToCreate.push(new Event(0, name, currentDate, currentDate, this.allMembers, description, this.decisions, this.dates));

    for (const repeat of this.repeats) {
      eventsToCreate.push(new Event(0, name, currentDate, currentDate, this.allMembers, description, this.decisions, repeat.dates));
    }

    console.log(eventsToCreate);

    for (const event of eventsToCreate) {
      this.eventsCreateUpdateService.createEvent(event).subscribe(
        (response: any) => {
          console.log(response);
          this.eventsService.fetchEvents();
          this.notificationService.info('EVENTS_ADMINISTRATION_CREATE_EVENT_SUCCESSFULLY_CREATED');

          const id = response.event.id;

          if (this.joined.length > 0) {
            console.log('create Event | Adding groups and subgroups to event');

            for (const group of this.joined) {
              if (group.type === GroupType.PARENTGROUP) {
                this.eventsCreateUpdateService.addGroupToEvent(id, group.id).subscribe(
                  (sdata: any) => {
                    console.log(sdata);
                  },
                  (error) => console.log(error)
                );
              } else {
                this.eventsCreateUpdateService.addSubgroupToEvent(id, group.id).subscribe(
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
}
