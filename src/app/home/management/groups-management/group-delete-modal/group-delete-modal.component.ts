import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

import {GroupsService} from '../groups.service';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-group-delete-modal',
  templateUrl: './group-delete-modal.component.html',
  styleUrls: ['./group-delete-modal.component.css'],
})
export class GroupDeleteModalComponent {
  groupID: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<GroupDeleteModalComponent>,
    private notificationService: NotificationService,
    private groupsService: GroupsService
  ) {
    this.groupID = data.groupID;
  }

  yes() {
    this.groupsService.deleteGroup(this.groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationService.info('MANAGEMENT_GROUPS_DELETE_GROUP_MODAL_SUCCESSFUL');
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
