import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {GroupsService} from '../groups.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-group-delete-modal',
  templateUrl: './group-delete-modal.component.html',
  styleUrls: ['./group-delete-modal.component.css']
})
export class GroupDeleteModalComponent {
  @ViewChild('successfullyDeletedGroup', {static: true}) successfullyDeletedGroup: TemplateRef<any>;
  groupID: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<GroupDeleteModalComponent>,
              private notificationsService: NotificationsService,
              private groupsService: GroupsService) {
    this.groupID = data.groupID;
  }

  yes() {
    this.groupsService.deleteGroup(this.groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.html(this.successfullyDeletedGroup, NotificationType.Success, null, 'success');
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
