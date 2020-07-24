import {Component, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../groups.service';

@Component({
  selector: 'app-group-update-modal',
  templateUrl: './group-update-modal.component.html',
  styleUrls: ['./group-update-modal.component.css']
})
export class GroupUpdateModalComponent {
  groupID: number;
  name: string;
  description: string;
  orderN: string;

  constructor(
    private groupsService: GroupsService,
    private dialogRef: MatDialogRef<GroupUpdateModalComponent>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupID = data.group.id;
    this.name = data.group.name;
    this.orderN = data.group.orderN;
    this.description = data.group.description;
  }

  onUpdate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const orderN = form.controls.orderN.value;

    const group = {
      name,
      description,
      orderN
    };
    console.log(group);

    this.groupsService.updateGroup(group, this.groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_UPDATE_GROUP_SUCCESSFUL')
        );
      },
      error => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }
}
