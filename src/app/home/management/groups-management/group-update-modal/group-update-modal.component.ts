import {Component, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../groups.service';
import {Permissions} from '../../../../permissions';
import {MyUserService} from '../../../my-user.service';

@Component({
  selector: 'app-group-update-modal',
  templateUrl: './group-update-modal.component.html',
  styleUrls: ['./group-update-modal.component.css'],
})
export class GroupUpdateModalComponent {
  groupID: number;
  name: string;
  description: string;
  orderN: string;
  hasPermissionToChangePermissions = false;
  permissions: string[];
  allPermissions: string[] = null;

  constructor(
    private groupsService: GroupsService,
    private myUserService: MyUserService,
    private dialogRef: MatDialogRef<GroupUpdateModalComponent>,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupID = data.group.id;
    this.name = data.group.name;
    this.orderN = data.group.orderN;
    this.description = data.group.description;
    this.permissions = data.group.permissions;
    this.allPermissions = Permissions.getAll();
    this.hasPermissionToChangePermissions = this.myUserService.hasPermission(Permissions.MANAGEMENT_EXTRA_USER_PERMISSIONS);
  }

  permissionsChange(permisions: string[]) {
    this.permissions = permisions;
    console.log(this.permissions);
  }

  onUpdate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const orderN = Number(form.controls.orderN.value);

    const group = {
      name,
      description,
      orderN,
      permissions: this.permissions,
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
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }
}
