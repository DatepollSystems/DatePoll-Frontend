import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {UsersService} from './users.service';
import {MyUserService} from '../../my-user.service';
import {ExcelService} from '../../../services/excel.service';

import {User} from './user.model';
import {Permissions} from '../../../permissions';
import {UserCreateModalComponent} from './user-create-modal/user-create-modal.component';
import {UserUpdateModalComponent} from './user-update-modal/user-update-modal.component';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  @ViewChild('successfullyActivatedAllUsers', {static: true}) successfullyActivatedAllUsers: TemplateRef<any>;
  usersLoaded = true;

  displayedColumns: string[] = ['title', 'firstname', 'surname', 'emails', 'birthday', 'join_date', 'streetname', 'streetnumber',
    'zipcode', 'location', 'phoneNumbers', 'activity', 'username', 'actions'];
  filterValue: string = null;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private usersSubscription: Subscription;
  users: User[];
  dataSource: MatTableDataSource<User>;

  private permissionSubscription: Subscription;

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private myUserService: MyUserService,
    private notificationsService: NotificationsService,
    private usersService: UsersService) {

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });

    this.usersLoaded = false;

    this.users = usersService.getUsers();
    this.refreshTable();

    if (this.users.length > 0) {
      this.usersLoaded = true;
    }

    this.usersSubscription = usersService.usersChange.subscribe((value) => {
      this.usersLoaded = true;

      this.users = value;
      this.refreshTable();
    });
  }

  ngOnInit() {
    if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
      this.router.navigate(['/home']);
    }

    this.refreshTable();
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.permissionSubscription.unsubscribe();
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openExportUsersBottomSheet(): void {
    this.bottomSheet.open(UsersExportBottomSheetComponent);
  }

  onActivateAll() {
    this.usersService.activateAll().subscribe(
      (data: any) => {
        console.log(data);
        this.usersService.fetchUsers();
        this.notificationsService.html(this.successfullyActivatedAllUsers, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }

  onCreate() {
    this.dialog.open(UserCreateModalComponent, {
      width: '80vh'
    });
  }

  onEdit(user: User) {
    this.dialog.open(UserUpdateModalComponent, {
      width: '80vh',
      data: {user: user}
    });
  }

  onDelete(userID: number) {
    this.usersService.deleteUser(userID);
  }

  refreshUsers() {
    this.usersLoaded = false;
    this.users = [];
    this.refreshTable();
    this.usersService.fetchUsers();
  }

}

@Component({
  selector: 'app-users-export-bottom-sheet',
  templateUrl: 'users-export-bottom-sheet.html',
  styles: ['mat-icon { margin-right: 15px }']
})
export class UsersExportBottomSheetComponent {
  @ViewChild('waitForExport', {static: true}) waitForExport: TemplateRef<any>;
  @ViewChild('successfullyExported', {static: true}) successfullyExported: TemplateRef<any>;

  constructor(private bottomSheetRef: MatBottomSheetRef<UsersExportBottomSheetComponent>, private excelService: ExcelService,
              private usersService: UsersService, private notificationsService: NotificationsService) {
  }

  exportExcelSheet() {
    this.notificationsService.html(this.waitForExport, NotificationType.Info, null, 'info');
    this.bottomSheetRef.dismiss();

    this.usersService.export().subscribe(
      (data: any) => {
        console.log(data);

        this.excelService.exportAsExcelFile(data.users, 'Mitglieder');

        this.notificationsService.html(this.successfullyExported, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }
}
