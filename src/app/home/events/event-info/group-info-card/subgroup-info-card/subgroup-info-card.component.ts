import {Component, Input} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

import {Permissions} from '../../../../../permissions';
import {TranslateService} from '../../../../../translation/translate.service';
import {ExcelService} from '../../../../../utils/excel.service';
import {MyUserService} from '../../../../my-user.service';

import {EventResultSubgroup} from '../../../models/event-result-subgroup.model';

@Component({
  selector: 'app-subgroup-info-card',
  templateUrl: './subgroup-info-card.component.html',
  styleUrls: ['./subgroup-info-card.component.css']
})
export class SubgroupInfoCardComponent {
  @Input()
  resultSubgroup: EventResultSubgroup;

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  showAdminModeInResultUserTable = false;

  constructor(myUserService: MyUserService, private excelService: ExcelService, private translate: TranslateService) {
    this.myUserService = myUserService;
  }

  changeAdminMode(ob: MatSlideToggleChange) {
    this.showAdminModeInResultUserTable = ob.checked;
  }

  exportSubgroupResultUsers() {
    this.excelService.exportAsExcelFile(
      this.resultSubgroup.getExportResultUser(),
      this.translate.getTranslationFor('EVENTS_VIEW_EVENT_EXPORT_SUBGROUP_FILE_NAME') + this.resultSubgroup.name
    );
  }
}
