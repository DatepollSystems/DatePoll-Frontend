import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Permissions} from '../../../permissions';
import {MyUserService} from '../../my-user.service';
import {EventsService} from '../events.service';
import {TranslateService} from '../../../translation/translate.service';
import {EventInfoResultUserExportModalComponent} from './event-info-result-user-export-modal/event-info-result-user-export-modal.component';

import {EventDate} from '../models/event-date.model';
import {EventResultGroup} from '../models/event-result-group.model';
import {Event} from '../models/event.model';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css'],
})
export class EventInfoComponent implements OnInit, OnDestroy {
  sendingRequest = true;

  eventSubscription: Subscription;
  event: Event;
  @Input()
  eventId = null;

  @Output()
  eventLoaded = new EventEmitter<Event>();

  name: string;
  description: string;
  descriptionMinRows = 1;

  startDate: Date;
  endDate: Date;
  dates: EventDate[] = [];

  resultGroups: EventResultGroup[];
  sortedResultGroups: EventResultGroup[];
  searchValue = '';

  showAdminModeInResultUserTable = false;

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  constructor(
    private eventsService: EventsService,
    myUserService: MyUserService,
    private bottomSheet: MatBottomSheet,
    private translate: TranslateService,
    private router: Router
  ) {
    this.myUserService = myUserService;
  }

  ngOnInit(): void {
    if (this.eventId != null) {
      if (isNaN(this.eventId)) {
        console.log('Event id not integer');
        this.router.navigate(['/home']);
        return;
      }
      this.event = this.eventsService.getEvent(this.eventId);
      this.eventSubscription = this.eventsService.eventChange.subscribe((value) => {
        this.event = value;
        this.refreshValues();
        this.sendingRequest = false;

        this.eventLoaded.emit(this.event);
      });
    }
  }

  ngOnDestroy() {
    this.eventSubscription?.unsubscribe();
  }

  refreshValues() {
    this.name = this.event.name;
    this.description = this.event.description;
    this.startDate = this.event.startDate;
    this.endDate = this.event.endDate;
    this.dates = this.event.getEventDates();
    this.resultGroups = this.event.getResultGroups();
    this.sortedResultGroups = this.resultGroups.slice();
    if (this.description?.length > 0) {
      this.descriptionMinRows = this.description?.split('\n').length + 1;
      // Check length because one would be to small
      if (this.descriptionMinRows === 1) {
        this.descriptionMinRows++;
      }
    }
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

  changeAdminMode(ob: MatSlideToggleChange) {
    this.showAdminModeInResultUserTable = ob.checked;
  }

  exportAllResultUsers() {
    this.bottomSheet.open(EventInfoResultUserExportModalComponent, {
      data: {
        resultUsers: this.event.getResultUsers(),
        date: this.event.startDate,
        fileName: this.translate.getTranslationFor('EVENTS_VIEW_EVENT_EXPORT_ALL_FILE_NAME'),
      },
    });
  }
}
