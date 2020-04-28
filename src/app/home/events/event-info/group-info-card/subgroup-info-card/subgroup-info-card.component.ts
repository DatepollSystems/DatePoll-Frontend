import {Component, Input} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

import {Permissions} from '../../../../../permissions';
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

  constructor(myUserService: MyUserService) {
    this.myUserService = myUserService;
  }

  changeAdminMode(ob: MatSlideToggleChange) {
    this.showAdminModeInResultUserTable = ob.checked;
  }
}
