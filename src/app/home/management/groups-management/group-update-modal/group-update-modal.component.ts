import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';

import {GroupsService} from '../groups.service';
import {TranslateService} from '../../../../translation/translate.service';

@Component({
  selector: 'app-group-update-modal',
  templateUrl: './group-update-modal.component.html',
  styleUrls: ['./group-update-modal.component.css']
})
export class GroupUpdateModalComponent {

  groupID: number;
  name: string;
  description: string;

  constructor(private groupsService: GroupsService,
              private dialogRef: MatDialogRef<GroupUpdateModalComponent>,
              private translate: TranslateService,
              private notificationsService: NotificationsService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.groupID = data.group.id;
    this.name = data.group.name;
    this.description = data.group.description;
  }

  onUpdate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    console.log('updateGroup: ' + name);
    console.log('updateGroup: ' + description);

    const group = {
      'name': name,
      'description': description
    };

    this.groupsService.updateGroup(group, this.groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_UPDATE_GROUP_SUCCESSFUL'));
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }

}
