import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GroupsService} from '../groups.service';
import {NgForm} from '@angular/forms';
import {Response} from '@angular/http';

@Component({
  selector: 'app-subgroup-update-modal',
  templateUrl: './subgroup-update-modal.component.html',
  styleUrls: ['./subgroup-update-modal.component.css']
})
export class SubgroupUpdateModalComponent {

  sendingRequest = false;

  groupID: number;
  subgroupID: number;
  name: string;
  description: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private groupsService: GroupsService, private dialogRef: MatDialogRef<SubgroupUpdateModalComponent>) {
    this.groupID = data.groupID;
    this.subgroupID = data.subgroup.id;
    this.name = data.subgroup.name;
    this.description = data.subgroup.description;
  }

  onUpdate(form: NgForm) {
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

    form.controls.name.disable();
    form.controls.description.disable();

    this.sendingRequest = true;
    this.groupsService.updateSubgroup(subgroup, this.subgroupID).subscribe(
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
