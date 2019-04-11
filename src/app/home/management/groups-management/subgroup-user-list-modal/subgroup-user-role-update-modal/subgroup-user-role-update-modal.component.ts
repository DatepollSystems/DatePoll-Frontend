import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GroupsService} from '../../groups.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-subgroup-user-role-update-modal',
  templateUrl: './subgroup-user-role-update-modal.component.html',
  styleUrls: ['./subgroup-user-role-update-modal.component.css']
})
export class SubgroupUserRoleUpdateModalComponent {

  public user: any;
  private readonly subgroupID: number;

  public sendingRequest = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<SubgroupUserRoleUpdateModalComponent>,
              private groupsService: GroupsService) {
    this.user = data.user;
    this.subgroupID = data.subgroupID;
  }

  onUpdate(form: NgForm) {
    const role = form.controls.role.value;
    form.controls.role.disable();

    this.sendingRequest = true;

    this.groupsService.updateUserInSubgroup(this.user.id, this.subgroupID, role).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroup(this.subgroupID);
        this.dialogRef.close();
      },
      (error) => console.log(error)
    );
  }

}
