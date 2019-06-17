import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

import {GroupsService} from '../groups.service';

@Component({
  selector: 'app-subgroup-create-modal',
  templateUrl: './subgroup-create-modal.component.html',
  styleUrls: ['./subgroup-create-modal.component.css']
})
export class SubgroupCreateModalComponent {

  sendingRequest = false;

  groupID: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private groupsService: GroupsService,
              private dialogRef: MatDialogRef<SubgroupCreateModalComponent>) {
    this.groupID = data.groupID;
  }

  onCreate(form: NgForm) {
    const name = form.controls.name.value;
    const description = form.controls.description.value;

    console.log('addSubgroup: ' + name);
    console.log('addSubgroup: ' + description);
    console.log('addSubgroup: ' + this.groupID);

    const subgroup = {
      'name': name,
      'description': description,
      'group_id': this.groupID
    };

    form.controls.name.disable();
    form.controls.description.disable();

    this.sendingRequest = true;
    this.groupsService.addSubgroup(subgroup).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.dialogRef.close();
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
        this.dialogRef.close();
      }
    );
  }

}
