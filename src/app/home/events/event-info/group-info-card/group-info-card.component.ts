import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

import {Permissions} from '../../../../permissions';
import {TranslateService} from '../../../../translation/translate.service';
import {ExcelService} from '../../../../utils/excel.service';
import {MyUserService} from '../../../my-user.service';

import {EventResultGroup} from '../../models/event-result-group.model';
import {EventResultSubgroup} from '../../models/event-result-subgroup.model';

@Component({
  selector: 'app-group-info-card',
  templateUrl: './group-info-card.component.html',
  styleUrls: ['./group-info-card.component.css']
})
export class GroupInfoCardComponent implements OnInit, OnChanges {
  @Input()
  resultGroup: EventResultGroup;

  @Input()
  searchValue = '';

  resultSubgroup: EventResultSubgroup[] = [];
  sortedResultSubgroup: EventResultSubgroup[] = [];

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  showAdminModeInResultUserTable = false;

  constructor(myUserService: MyUserService, private excelService: ExcelService, private translate: TranslateService) {
    this.myUserService = myUserService;
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

  changeAdminMode(ob: MatSlideToggleChange) {
    this.showAdminModeInResultUserTable = ob.checked;
  }

  exportGroupResultUsers() {
    this.excelService.exportAsExcelFile(
      this.resultGroup.getExportResultUser(),
      this.translate.getTranslationFor('EVENTS_VIEW_EVENT_EXPORT_GROUP_FILE_NAME') + this.resultGroup.name
    );
  }
}
