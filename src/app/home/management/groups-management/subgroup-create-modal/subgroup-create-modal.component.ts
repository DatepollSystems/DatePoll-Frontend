import {Component, Inject, OnInit} from '@angular/core';
import {GroupsService} from '../groups.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Response} from '@angular/http';

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
      (response: Response) => {
        const data = response.json();
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
