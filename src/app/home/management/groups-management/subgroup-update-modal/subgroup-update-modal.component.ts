import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';

import {GroupsService} from '../groups.service';
import {TranslateService} from '../../../../translation/translate.service';

@Component({
  selector: 'app-subgroup-update-modal',
  templateUrl: './subgroup-update-modal.component.html',
  styleUrls: ['./subgroup-update-modal.component.css']
})
export class SubgroupUpdateModalComponent {
  groupID: number;
  subgroupID: number;
  name: string;
  description: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private groupsService: GroupsService, private dialogRef: MatDialogRef<SubgroupUpdateModalComponent>,
              private translate: TranslateService,
              private notificationsService: NotificationsService) {
    this.groupID = data.groupID;
    this.subgroupID = data.subgroup.id;
    this.name = data.subgroup.name;
    this.description = data.subgroup.description;
  }

  onUpdate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    console.log('updateSubgroup: ' + this.subgroupID);
    console.log('updateSubgroup: ' + name);
    console.log('updateSubgroup: ' + description);
    console.log('updateSubgroup: ' + this.groupID);

    const subgroup = {
      'name': name,
      'description': description,
      'group_id': this.groupID
    };
    this.groupsService.updateSubgroup(subgroup, this.subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_UPDATE_SUBGROUP_SUCCESSFUL'));
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }

}
