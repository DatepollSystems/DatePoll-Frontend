import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {GroupsService} from '../groups.service';
import {Subscription} from 'rxjs';
import {GroupUserRoleUpdateModalComponent} from './group-user-role-update-modal/group-user-role-update-modal.component';

@Component({
  selector: 'app-group-user-list-modal',
  templateUrl: './group-user-list-modal.component.html',
  styleUrls: ['./group-user-list-modal.component.css']
})
export class GroupUserListModalComponent implements OnDestroy {
  displayedColumns: string[] = ['role', 'firstname', 'surname', 'actions'];
  filterValue: string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public group: any;
  dataSource: MatTableDataSource<any>;
  public groupName = '';
  public sendingRequest = false;
  private readonly groupID: number;
  private groupSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private groupsService: GroupsService) {
    this.groupID = data.groupID;
    this.group = this.groupsService.getGroup(this.groupID);
    this.refreshTable();
    this.groupSubscription = this.groupsService.groupChange.subscribe(value => {
      this.group = value;
      this.refreshTable();
    });
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
    this.groupsService.setGroup(null);
  }

  refreshTable() {
    if (this.group != null) {
      this.groupName = this.group.name;

      this.dataSource = new MatTableDataSource(this.group.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEditRole(user: any) {
    this.dialog.open(GroupUserRoleUpdateModalComponent, {
      width: '80vh',
      data: {user: user, groupID: this.groupID}
    });
  }

  onRemoveUserFromGroup(userID: number) {
    this.sendingRequest = true;
    this.groupsService.removeUserFromGroup(userID, this.groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroup(this.groupID);
        this.sendingRequest = false;
      },
      error => console.log(error)
    );
  }
}
