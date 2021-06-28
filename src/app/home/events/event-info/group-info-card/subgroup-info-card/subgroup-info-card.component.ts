import {Component, Input} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

import {Permissions} from '../../../../../permissions';
import {TranslateService} from 'dfx-translate';
import {MyUserService} from '../../../../my-user.service';
import {EventInfoResultUserExportModalComponent} from '../../event-info-result-user-export-modal/event-info-result-user-export-modal.component';

import {EventResultSubgroup} from '../../../models/event-result-subgroup.model';

@Component({
  selector: 'app-subgroup-info-card',
  templateUrl: './subgroup-info-card.component.html',
  styleUrls: ['./subgroup-info-card.component.css'],
})
export class SubgroupInfoCardComponent {
  @Input()
  resultSubgroup: EventResultSubgroup;

  @Input()
  simpleView = true;

  public myUserService: MyUserService;
  public EVENTS_ADMINISTRATION_PERMISSION = Permissions.EVENTS_ADMINISTRATION;
  public ROOT_PERMISSION = Permissions.ROOT_ADMINISTRATION;

  showAdminModeInResultUserTable = false;

  constructor(myUserService: MyUserService, private bottomSheet: MatBottomSheet, private translate: TranslateService) {
    this.myUserService = myUserService;
  }

  changeAdminMode(ob: MatSlideToggleChange) {
    this.showAdminModeInResultUserTable = ob.checked;
  }

  exportSubgroupResultUsers() {
    this.bottomSheet.open(EventInfoResultUserExportModalComponent, {
      data: {
        resultUsers: this.resultSubgroup.getResultUsers(),
        date: this.resultSubgroup.event.startDate,
        fileName: this.translate.translate('EVENTS_VIEW_EVENT_EXPORT_SUBGROUP_FILE_NAME') + this.resultSubgroup.name,
      },
    });
  }
}
