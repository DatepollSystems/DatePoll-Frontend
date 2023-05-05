import {Component, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {GroupsService} from '../groups.service';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-subgroup-update-modal',
  templateUrl: './subgroup-update-modal.component.html',
  styleUrls: ['./subgroup-update-modal.component.css'],
})
export class SubgroupUpdateModalComponent {
  groupID: number;
  subgroupID: number;
  name: string;
  description: string;
  orderN: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private dialogRef: MatDialogRef<SubgroupUpdateModalComponent>,
    private notificationService: NotificationService
  ) {
    this.groupID = data.groupID;
    this.subgroupID = data.subgroup.id;
    this.name = data.subgroup.name;
    this.description = data.subgroup.description;
    this.orderN = data.subgroup.orderN;
  }

  onUpdate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const orderN = Number(form.controls.orderN.value);

    const subgroup = {
      name,
      description,
      orderN,
      group_id: this.groupID,
    };
    console.log(subgroup);
    this.groupsService.updateSubgroup(subgroup, this.subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationService.info('MANAGEMENT_GROUPS_UPDATE_SUBGROUP_SUCCESSFUL');
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }
}
