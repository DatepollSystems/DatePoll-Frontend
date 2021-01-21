import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../groups.service';

@Component({
  selector: 'app-group-create-modal',
  templateUrl: './group-create-modal.component.html',
  styleUrls: ['./group-create-modal.component.css'],
})
export class GroupCreateModalComponent {
  constructor(
    private groupsService: GroupsService,
    private dialogRef: MatDialogRef<GroupCreateModalComponent>,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {}

  onCreate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const orderN = Number(form.controls.orderN.value);

    const group = {
      name,
      description,
      orderN,
    };
    console.log(group);

    this.groupsService.addGroup(group).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_CREATE_GROUP_SUCCESSFUL')
        );
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }
}
