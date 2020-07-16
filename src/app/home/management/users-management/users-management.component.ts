import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {TranslateService} from '../../../translation/translate.service';
import {ExcelService} from '../../../utils/excel.service';
import {MyUserService} from '../../my-user.service';
import {UsersService} from './users.service';

import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {UserCreateModalComponent} from './user-create-modal/user-create-modal.component';
import {UserDeleteModalComponent} from './user-delete-modal/user-delete-modal.component';
import {UserUpdateModalComponent} from './user-update-modal/user-update-modal.component';

import {MatMultiSort, MatMultiSortTableDataSource, TableData} from 'ngx-mat-multi-sort';
import {User} from './user.model';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  usersLoaded = true;
  filterValue = '';

  CLIENT_SIDE = true;
  table: TableData<User>;
  @ViewChild(MatMultiSort, {static: false}) sort: MatMultiSort;

  users: User[];
  usersCopy: User[];
  dataSource: MatTableDataSource<User>;
  private usersSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private myUserService: MyUserService,
    private notificationsService: NotificationsService,
    private usersService: UsersService
  ) {
    this.usersLoaded = false;

    this.users = usersService.getUsers();
    this.usersCopy = this.users.slice();

    if (this.users.length > 0) {
      this.usersLoaded = true;
    }

    this.usersSubscription = usersService.usersChange.subscribe(value => {
      this.usersLoaded = true;

      this.users = value;
      this.usersCopy = this.users.slice();
      this.getData();
    });

    this.table = new TableData<User>(
      [
        {id: 'memberNumber', name: 'memberNumber'},
        {id: 'title', name: 'title'},
        {id: 'firstname', name: 'firstname'},
        {id: 'surname', name: 'surname'},
        {id: 'emails', name: 'emails'},
        {id: 'birthday', name: 'birthday'},
        {id: 'join_date', name: 'join_date'},
        {id: 'streetname', name: 'streetname'},
        {id: 'streetnumber', name: 'streetnumber'},
        {id: 'zipcode', name: 'location'},
        {id: 'location', name: 'location'},
        {id: 'phoneNumbers', name: 'phoneNumbers'},
        {id: 'activity', name: 'activity'},
        {id: 'username', name: 'username'},
        {id: 'bvMember', name: 'bvMember'},
        {id: 'actions', name: 'actions'}
      ],
      {defaultSortParams: ['surname'], defaultSortDirs: ['asc']}
    );
  }

  ngOnInit() {
    this.table.nextObservable.subscribe(() => {
      this.getData();
    });
    this.table.sortObservable.subscribe(() => {
      this.getData();
    });
    this.table.previousObservable.subscribe(() => {
      this.getData();
    });
    this.table.sizeObservable.subscribe(() => {
      this.getData();
    });

    setTimeout(() => {
      this.refreshTable();
    });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  refreshTable() {
    this.table.dataSource = new MatMultiSortTableDataSource(this.sort, this.CLIENT_SIDE);

    this.table.updateColumNames([
      {id: 'memberNumber', name: this.translate.getTranslationFor('MANAGEMENT_USERS_MEMBER_NUMBER')},
      {id: 'title', name: this.translate.getTranslationFor('MANAGEMENT_USERS_TITLE')},
      {id: 'firstname', name: this.translate.getTranslationFor('MANAGEMENT_USERS_FIRSTNAME')},
      {id: 'surname', name: this.translate.getTranslationFor('MANAGEMENT_USERS_SURNAME')},
      {id: 'emails', name: this.translate.getTranslationFor('MANAGEMENT_USERS_EMAIL_ADDRESSES')},
      {id: 'birthday', name: this.translate.getTranslationFor('MANAGEMENT_USERS_BIRTHDAY')},
      {id: 'join_date', name: this.translate.getTranslationFor('MANAGEMENT_USERS_JOIN_DATE')},
      {id: 'streetname', name: this.translate.getTranslationFor('MANAGEMENT_USERS_STREETNAME')},
      {id: 'streetnumber', name: this.translate.getTranslationFor('MANAGEMENT_USERS_STREETNUMBER')},
      {id: 'zipcode', name: this.translate.getTranslationFor('MANAGEMENT_USERS_ZIPCODE')},
      {id: 'location', name: this.translate.getTranslationFor('MANAGEMENT_USERS_LOCATION')},
      {id: 'phoneNumbers', name: this.translate.getTranslationFor('MANAGEMENT_USERS_PHONENUMBERS')},
      {id: 'activity', name: this.translate.getTranslationFor('MANAGEMENT_USERS_ACTIVITY')},
      {id: 'username', name: this.translate.getTranslationFor('MANAGEMENT_USERS_USERNAME')},
      {id: 'bvMember', name: this.translate.getTranslationFor('MANAGEMENT_USERS_BV_MEMBER')},
      {id: 'actions', name: this.translate.getTranslationFor('MANAGEMENT_USERS_ACTIONS')}
    ]);

    this.table.pageSize = 10;
    this.getData();
  }

  getData() {
    const res = this.list(this.table.sortParams, this.table.sortDirs, this.table.pageIndex, this.table.pageSize);
    this.table.totalElements = res.totalElements;
    this.table.pageIndex = res.page;
    this.table.pageSize = res.pagesize;
    this.table.data = res.users;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim().toLowerCase();
    this.users = [];
    for (const user of this.usersCopy) {
      const title = user.title?.trim().toLowerCase();
      const firstname = user.firstname.trim().toLowerCase();
      const surname = user.surname.trim().toLowerCase();
      const memberNumber = user.memberNumber?.trim().toLowerCase();
      const emailAddress = user
        .getEmailAddressesAsString()
        .trim()
        .toLowerCase();
      const numbers = user
        .getPhoneNumbersAsString()
        .trim()
        .toLowerCase();
      const streetName = user.streetname.trim().toLowerCase();
      const streetNumber = user.streetnumber.trim().toLowerCase();
      const location = user.location.trim().toLowerCase();
      const zipcode = user.zipcode
        .toString()
        .trim()
        .toLowerCase();
      const activity = user.activity?.trim().toLowerCase();
      if (
        title?.includes(this.filterValue) ||
        firstname.includes(this.filterValue) ||
        surname.includes(this.filterValue) ||
        memberNumber?.includes(this.filterValue) ||
        emailAddress.includes(this.filterValue) ||
        numbers.includes(this.filterValue) ||
        streetName.includes(this.filterValue) ||
        streetNumber.includes(this.filterValue) ||
        location.includes(this.filterValue) ||
        zipcode.includes(this.filterValue) ||
        activity?.includes(this.filterValue)
      ) {
        this.users.push(user);
      }
    }
    this.getData();
  }

  openExportUsersBottomSheet(): void {
    this.bottomSheet.open(UsersExportBottomSheetComponent);
  }

  onActivateAll() {
    const answers = [
      {
        answer: this.translate.getTranslationFor('YES'),
        value: 'yes'
      },
      {
        answer: this.translate.getTranslationFor('NO'),
        value: 'no'
      }
    ];
    const question = this.translate.getTranslationFor('MANAGEMENT_USERS_ACTIVATE_ALL_QUESTION_DIALOG');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.usersService.activateAll().subscribe(
            (data: any) => {
              console.log(data);
              this.usersService.fetchUsers();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('MANAGEMENT_USERS_ACTIVATE_ALL_FINISHED')
              );
            },
            error => console.log(error)
          );
        }
      }
    });
  }

  onCreate() {
    this.dialog.open(UserCreateModalComponent, {
      width: '80vh'
    });
  }

  onEdit(user: User) {
    this.dialog.open(UserUpdateModalComponent, {
      width: '80vh',
      data: {user}
    });
  }

  onDelete(userID: number) {
    this.bottomSheet.open(UserDeleteModalComponent, {
      data: {userID}
    });
  }

  refreshUsers() {
    this.usersLoaded = false;
    this.users = [];
    this.refreshTable();
    this.usersService.fetchUsers();
  }

  list(sorting: string[] = [], dirs: string[] = [], page = 0, pagesize = 20) {
    const tempUsers = Object.assign([], this.users);
    const result = {
      users: [],
      page,
      pagesize,
      totalElements: tempUsers.length
    };

    if (sorting.length === 0) {
      result.users = tempUsers.slice(page * pagesize, (page + 1) * pagesize);
    } else if (sorting.length > 0) {
      const sortedUsers = tempUsers.sort((u1, u2) => {
        return this._sortData(u1, u2, sorting, dirs);
      });
      result.users = sortedUsers.slice(page * pagesize, (page + 1) * pagesize);
    }

    return result;
  }

  _sortData(d1: User, d2: User, sorting: string[], dirs: string[]): number {
    if (d1[sorting[0]] > d2[sorting[0]]) {
      return dirs[0] === 'asc' ? 1 : -1;
    } else if (d1[sorting[0]] < d2[sorting[0]]) {
      return dirs[0] === 'asc' ? -1 : 1;
    } else {
      if (sorting.length > 1) {
        sorting = sorting.slice(1, sorting.length);
        dirs = dirs.slice(1, dirs.length);
        return this._sortData(d1, d2, sorting, dirs);
      } else {
        return 0;
      }
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
@Component({
  selector: 'app-users-export-bottom-sheet',
  templateUrl: 'users-export-bottom-sheet.html',
  styles: ['mat-icon { margin-right: 15px }']
})
export class UsersExportBottomSheetComponent {
  @ViewChild('waitForExport', {static: true}) waitForExport: TemplateRef<any>;
  @ViewChild('successfullyExported', {static: true}) successfullyExported: TemplateRef<any>;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<UsersExportBottomSheetComponent>,
    private excelService: ExcelService,
    private usersService: UsersService,
    private notificationsService: NotificationsService
  ) {}

  exportExcelSheet() {
    this.notificationsService.html(this.waitForExport, NotificationType.Info, null, 'info');
    this.bottomSheetRef.dismiss();

    this.usersService.export().subscribe(
      (data: any) => {
        console.log(data);

        this.excelService.exportAsExcelFile(data.users, 'Mitglieder');

        this.notificationsService.html(this.successfullyExported, NotificationType.Success, null, 'success');
      },
      error => console.log(error)
    );
  }
}
