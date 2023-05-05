import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

import {Permissions} from '../../../../permissions';
import {TranslateService} from 'dfx-translate';
import {MyUserService} from '../../../my-user.service';
import {Converter} from '../../../../utils/helper/Converter';
import {EventInfoResultUserExportModalComponent} from '../event-info-result-user-export-modal/event-info-result-user-export-modal.component';

import {EventResultGroup} from '../../models/event-result-group.model';
import {EventResultSubgroup} from '../../models/event-result-subgroup.model';

@Component({
  selector: 'app-group-info-card',
  templateUrl: './group-info-card.component.html',
  styleUrls: ['./group-info-card.component.css'],
})
export class GroupInfoCardComponent implements OnInit, OnChanges {
  @Input()
  resultGroup: EventResultGroup;

  @Input()
  searchValue = '';

  resultSubgroup: EventResultSubgroup[] = [];
  sortedResultSubgroup: EventResultSubgroup[] = [];

  simpleViewToken = 'event_info_simple_view';
  simpleView = true;

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  showAdminModeInResultUserTable = false;

  constructor(myUserService: MyUserService, private bottomSheet: MatBottomSheet, private translate: TranslateService) {
    this.myUserService = myUserService;
    const simpleView = localStorage.getItem(this.simpleViewToken);
    if (simpleView != null) {
      this.simpleView = Converter.stringToBoolean(simpleView);
    }
  }

  ngOnInit() {
    this.resultSubgroup = this.resultGroup.getResultSubgroups();
    this.sortedResultSubgroup = this.resultSubgroup.slice();
  }

  ngOnChanges(): void {
    if (this.searchValue.length === 0 || this.resultGroup.name.toLowerCase().includes(this.searchValue.toLowerCase())) {
      this.sortedResultSubgroup = this.resultSubgroup.slice();
    } else {
      this.sortedResultSubgroup = [];

      for (const resultSubgroup of this.resultGroup.getResultSubgroups()) {
        if (resultSubgroup.name.toLowerCase().includes(this.searchValue.toLowerCase())) {
          this.sortedResultSubgroup.push(resultSubgroup);
          break;
        }
      }
    }
  }

  trackByFn(inde, item) {
    return item.id;
  }

  simpleViewChange($event) {
    console.log('set simple view to ' + $event.checked);
    localStorage.setItem(this.simpleViewToken, Converter.booleanToString($event.checked));
  }

  changeAdminMode(ob: MatSlideToggleChange) {
    this.showAdminModeInResultUserTable = ob.checked;
  }

  exportGroupResultUsers() {
    this.bottomSheet.open(EventInfoResultUserExportModalComponent, {
      data: {
        resultUsers: this.resultGroup.getResultUsers(),
        date: this.resultGroup.event.startDate,
        fileName: this.translate.translate('EVENTS_VIEW_EVENT_EXPORT_GROUP_FILE_NAME') + this.resultGroup.name,
      },
    });
  }
}
