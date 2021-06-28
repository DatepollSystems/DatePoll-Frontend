import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

import {GroupsService} from '../groups.service';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-subgroup-delete-modal',
  templateUrl: './subgroup-delete-modal.component.html',
  styleUrls: ['./subgroup-delete-modal.component.css'],
})
export class SubgroupDeleteModalComponent {
  subgroupID: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<SubgroupDeleteModalComponent>,
    private notificationService: NotificationService,
    private groupsService: GroupsService
  ) {
    this.subgroupID = data.subgroupID;
  }

  yes() {
    this.groupsService.deleteSubgroup(this.subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationService.info('MANAGEMENT_GROUPS_DELETE_SUBGROUP_MODAL_SUCCESSFUL');
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
