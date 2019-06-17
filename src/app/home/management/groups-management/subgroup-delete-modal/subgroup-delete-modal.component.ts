import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {GroupsService} from '../groups.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-subgroup-delete-modal',
  templateUrl: './subgroup-delete-modal.component.html',
  styleUrls: ['./subgroup-delete-modal.component.css']
})
export class SubgroupDeleteModalComponent {
  @ViewChild('successfullyDeletedSubgroup', {static: true}) successfullyDeletedSubgroup: TemplateRef<any>;
  subgroupID: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<SubgroupDeleteModalComponent>,
              private notificationsService: NotificationsService,
              private groupsService: GroupsService) {
    this.subgroupID = data.subgroupID;
  }

  yes() {
    this.groupsService.deleteSubgroup(this.subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.html(this.successfullyDeletedSubgroup, NotificationType.Success, null, 'success');
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
