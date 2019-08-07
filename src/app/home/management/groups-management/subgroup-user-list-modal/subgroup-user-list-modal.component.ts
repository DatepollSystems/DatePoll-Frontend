import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {GroupsService} from '../groups.service';
import {SubgroupUserRoleUpdateModalComponent} from './subgroup-user-role-update-modal/subgroup-user-role-update-modal.component';

@Component({
  selector: 'app-subgroup-user-list-modal',
  templateUrl: './subgroup-user-list-modal.component.html',
  styleUrls: ['./subgroup-user-list-modal.component.css']
})
export class SubgroupUserListModalComponent implements OnDestroy {

  displayedColumns: string[] = ['role', 'firstname', 'surname', 'actions'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public subgroup: any;
  dataSource: MatTableDataSource<any>;
  public subgroupName = '';
  public sendingRequest = false;
  private readonly subgroupID: number;
  private subgroupSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private groupsService: GroupsService) {

    this.subgroupID = data.subgroupID;
    this.subgroup = this.groupsService.getSubgroup(this.subgroupID);
    this.refreshTable();
    this.subgroupSubscription = this.groupsService.subgroupChange.subscribe((value) => {
      this.subgroup = value;
      this.refreshTable();
    });
  }

  ngOnDestroy(): void {
    this.subgroupSubscription.unsubscribe();
    this.groupsService.setGroup(null);
  }

  refreshTable() {
    if (this.subgroup != null) {
      this.subgroupName = this.subgroup.name;

      this.dataSource = new MatTableDataSource(this.subgroup.users);
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
    this.dialog.open(SubgroupUserRoleUpdateModalComponent, {
      width: '80vh',
      data: {user: user, subgroupID: this.subgroupID}
    });
  }

  onRemoveUserFromSubgroup(userID: number) {
    this.sendingRequest = true;
    this.groupsService.removeUserFromSubgroup(userID, this.subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchSubgroup(this.subgroupID);
        this.sendingRequest = false;
      },
      (error) => console.log(error)
    );
  }

}
