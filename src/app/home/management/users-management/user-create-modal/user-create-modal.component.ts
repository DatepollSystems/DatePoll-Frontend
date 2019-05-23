import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgForm} from '@angular/forms';
import {MatDialogRef, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {UsersService} from '../users.service';
import {GroupsService} from '../../groups-management/groups.service';
import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {MyUserService} from '../../../my-user.service';

import {PhoneNumber} from '../../../phoneNumber.model';
import {Group} from '../../groups-management/group.model';
import {PerformanceBadge} from '../../performance-badges-management/performanceBadge.model';
import {Instrument} from '../../performance-badges-management/instrument.model';
import {UserPerformanceBadge} from '../userPerformanceBadge.model';
import {Permissions} from '../../../../permissions';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.css']
})
export class UserCreateModalComponent implements OnDestroy {

  @ViewChild('successfullyCreatedUser') successfullyCreatedUser: TemplateRef<any>;

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  sendingRequest = false;

  birthday: Date;
  join_date: Date;
  phoneNumberCount = 0;
  phoneNumbers: PhoneNumber[] = [];

  groups: Group[] = [];
  groupsSubscription: Subscription;

  joined: any[] = [];
  free: any[] = [];

  hasPermissionToChangePermission = false;
  permissions: string[] = [];

  userPerformanceBadgeCount = 0;
  userPerformanceBadges: UserPerformanceBadge[] = [];
  performanceBadges: PerformanceBadge[] = [];
  performanceBadgesSubscription: Subscription;
  selectedPerformanceBadge: PerformanceBadge;
  instruments: Instrument[] = [];
  instrumentsSubscription: Subscription;
  selectedInstrument: Instrument;
  performanceBadgeDate: Date = null;

  constructor(private usersService: UsersService,
              private myUserService: MyUserService,
              private dialogRef: MatDialogRef<UserCreateModalComponent>,
              private groupsService: GroupsService,
              private notificationsService: NotificationsService,
              private performanceBadgesService: PerformanceBadgesService) {
    this.dataSource = new MatTableDataSource(this.phoneNumbers);

    this.groups = this.groupsService.getGroups();
    this.remakeFreeAndJoinedList();
    this.groupsSubscription = this.groupsService.groupsChange.subscribe((value) => {
      this.groups = value;
      this.remakeFreeAndJoinedList();
    });

    this.performanceBadges = this.performanceBadgesService.getPerformanceBadges();
    this.performanceBadgesSubscription = this.performanceBadgesService.performanceBadgesChange.subscribe((value) => {
      this.performanceBadges = value;
    });

    this.instruments = this.performanceBadgesService.getInstruments();
    this.instrumentsSubscription = this.performanceBadgesService.instrumentsChange.subscribe((value) => {
      this.instruments = value;
    });

    this.hasPermissionToChangePermission = this.myUserService.hasPermission(Permissions.ROOT_ADMINISTRATION);
  }

  ngOnDestroy() {
    this.groupsSubscription.unsubscribe();
    this.performanceBadgesSubscription.unsubscribe();
    this.instrumentsSubscription.unsubscribe();
  }

  remakeFreeAndJoinedList() {
    this.free = [];
    this.joined = [];

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];

      const groupObject = {
        'id': group.id,
        'name': group.name,
        'type': 'parentgroup'
      };

      this.free.push(groupObject);

      for (let j = 0; j < group.getSubgroups().length; j++) {
        const subgroup = group.getSubgroups()[j];

        const subgroupObject = {
          'id': subgroup.id,
          'name': subgroup.name,
          'type': 'subgroup',
          'group_id': group.id,
          'group_name': group.name
        };

        this.free.push(subgroupObject);
      }
    }

    setTimeout(function () {
      document.getElementById('joined-list').style.height = document.getElementById('free-list').clientHeight.toString() + 'px';
      console.log('Free height:' + document.getElementById('free-list').clientHeight);
      console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
    }, 1000);
  }

  addPhoneNumber(form: NgForm) {
    this.phoneNumbers.push(new PhoneNumber(this.phoneNumberCount, form.value.label, form.value.phoneNumber));
    this.phoneNumberCount++;
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
    form.reset();
  }

  removePhoneNumber(id: number) {
    const localPhoneNumbers = [];
    for (let i = 0; i < this.phoneNumbers.length; i++) {
      if (this.phoneNumbers[i].id !== id) {
        localPhoneNumbers.push(this.phoneNumbers[i]);
      }
    }

    this.phoneNumbers = localPhoneNumbers;
    this.dataSource = new MatTableDataSource(this.phoneNumbers);
  }

  addPermission(form: NgForm) {
    const permission = form.controls.permission.value;
    this.permissions.push(permission);
    form.reset();
  }

  removePermission(permission: string) {
    const permissions = [];
    for (let i = 0; i < this.permissions.length; i++) {
      if (!this.permissions[i].includes(permission)) {
        permissions.push(this.permissions[i]);
      }
    }
    this.permissions = permissions;
  }

  addPerformanceBadge(form: NgForm) {
    if (this.selectedInstrument == null || this.selectedPerformanceBadge == null) {
      return;
    }

    let grade = form.controls.performanceBadgeGrade.value;
    let node = form.controls.performanceBadgeNote.value;
    if (grade != null) {
      if (grade.length === 0) {
        grade = null;
      }
    }
    if (node != null) {
      if (node.length === 0) {
        node = null;
      }
    }

    this.userPerformanceBadges.push(new UserPerformanceBadge(this.userPerformanceBadgeCount, this.selectedPerformanceBadge.id,
      this.selectedInstrument.id, this.selectedPerformanceBadge.name, this.selectedInstrument.name, this.performanceBadgeDate,
      grade, node));

    this.userPerformanceBadgeCount++;
    form.reset();
    this.performanceBadgeDate = null;
  }

  removePerformanceBadge(id: number) {
    const localUserPerformanceBadges = [];
    for (let i = 0; i < this.userPerformanceBadges.length; i++) {
      if (this.userPerformanceBadges[i].id !== id) {
        localUserPerformanceBadges.push(this.userPerformanceBadges[i]);
      }
    }

    this.userPerformanceBadges = localUserPerformanceBadges;
  }

  create(form: NgForm) {
    this.sendingRequest = true;

    const title = form.controls.title.value;
    const email = form.controls.email.value;
    const firstname = form.controls.firstname.value;
    const surname = form.controls.surname.value;
    const streetname = form.controls.streetname.value;
    const streetnumber = form.controls.streetnumber.value;
    const zipcode = form.controls.zipcode.value;
    const location = form.controls.location.value;
    const activity = form.controls.activity.value;
    let activated = form.controls.activated.value;

    if (activated.toString().length === 0) {
      activated = false;
    }

    let d = new Date(this.birthday);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const birthdayformatted = [year, month, day].join('-');

    d = new Date(this.join_date);
    month = '' + (d.getMonth() + 1);
    day = '' + d.getDate();
    year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const join_dateformatted = [year, month, day].join('-');

    console.log('create User | title: ' + title);
    console.log('create User | email: ' + email);
    console.log('create User | firstname: ' + firstname);
    console.log('create User | surname: ' + surname);
    console.log('create User | birthday: ' + birthdayformatted);
    console.log('create User | join_date: ' + join_dateformatted);
    console.log('create User | streetname: ' + streetname);
    console.log('create User | streetnumber: ' + streetnumber);
    console.log('create User | zipcode: ' + zipcode);
    console.log('create User | location: ' + location);
    console.log('create User | activity: ' + activity);
    console.log('create User | activated: ' + activated);

    const phoneNumbersObject = [];

    for (let i = 0; i < this.phoneNumbers.length; i++) {
      const phoneNumberObject = {
        'label': this.phoneNumbers[i].label,
        'number': this.phoneNumbers[i].phoneNumber
      };
      phoneNumbersObject.push(phoneNumberObject);
    }

    const userObject = {
      'title': title,
      'email': email,
      'firstname': firstname,
      'surname': surname,
      'birthday': birthdayformatted,
      'join_date': join_dateformatted,
      'streetname': streetname,
      'streetnumber': streetnumber,
      'zipcode': zipcode,
      'location': location,
      'activated': activated,
      'activity': activity,
      'phoneNumbers': phoneNumbersObject,
      'permissions': this.permissions
    };
    console.log(userObject);

    form.controls.title.disable();
    form.controls.email.disable();
    form.controls.firstname.disable();
    form.controls.surname.disable();
    form.controls.streetname.disable();
    form.controls.streetnumber.disable();
    form.controls.zipcode.disable();
    form.controls.location.disable();
    form.controls.activity.disable();
    form.controls.activated.disable();
    document.getElementById('datepicker-birthday').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-birthday-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-join_date').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-join_date-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('addPhoneNumber-button').setAttribute('disabled', 'disabled');
    document.getElementById('phoneNumber').setAttribute('disabled', 'disabled');
    document.getElementById('label').setAttribute('disabled', 'disabled');
    document.getElementById('addPermission-button').setAttribute('disabled', 'disabled');
    document.getElementById('permission').setAttribute('disabled', 'disabled');
    document.getElementById('addPerformanceBadge-button').setAttribute('disabled', 'disabled');
    document.getElementById('instrument').setAttribute('disabled', 'disabled');
    document.getElementById('performanceBadge').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-performanceBadge').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-performanceBadge-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('performanceBadge-grade').setAttribute('disabled', 'disabled');
    document.getElementById('performanceBadge-note').setAttribute('disabled', 'disabled');

    this.dialogRef.close();

    this.usersService.addUser(userObject).subscribe(
      (data: any) => {
        console.log(data);

        console.log('create User | User created!');
        const userID = data.user.id;
        console.log('create User | Userid: ' + userID);

        if (this.joined.length > 0) {
          console.log('create User | Adding user to groups and subgroups');

          for (let i = 0; i < this.joined.length; i++) {
            const group = this.joined[i];

            if (group.type.includes('parentgroup')) {
              this.groupsService.addUserToGroup(userID, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                (error) => console.log(error)
              );
            } else {
              this.groupsService.addUserToSubgroup(userID, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                (error) => console.log(error)
              );
            }
          }
        }

        if (this.userPerformanceBadges.length > 0) {
          console.log('create User | Adding performance badges');

          for (let i = 0; i < this.userPerformanceBadges.length; i++) {
            this.performanceBadgesService.addUserHasPerformanceBadgeWithInstrument(userID, this.userPerformanceBadges[i]).subscribe(
              (sdata: any) => {
                console.log(sdata);
              },
              (error) => console.log(error)
            );
          }
        }

        this.usersService.fetchUsers();
        this.notificationsService.html(this.successfullyCreatedUser, NotificationType.Success, null, 'success');
      },
      (error) => {
        console.log(error);
        this.usersService.fetchUsers();
      }
    );
  }

  dropToJoined(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const group = event.previousContainer.data[event.previousIndex];

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      console.log('Element to move: ');
      console.log(group);

      // @ts-ignore
      const type = group.type;

      if (type.includes('subgroup')) {
        console.log('Element is a subgroup');

        // @ts-ignore
        const groupID = group.group_id;
        for (let i = 0; i < this.free.length; i++) {
          const freeType = this.free[i].type;
          if (freeType.includes('parentgroup')) {
            if (this.free[i].id === groupID) {
              console.log('Detected the parent group which is not in joined!');
              console.log('Parent group element: ');
              const saveGroup = this.free[i];
              console.log(saveGroup);
              this.joined.push(saveGroup);
              this.free.splice(i, 1);
            }
          }
        }
      }
    }
  }

  dropToFree(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const group = event.previousContainer.data[event.previousIndex];

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      console.log('Element to move: ');
      console.log(group);

      // @ts-ignore
      const type = group.type;

      if (type.includes('parentgroup')) {
        console.log('Element is a parentgroup');

        const toSplice = [];

        // @ts-ignore
        const groupID = group.id;
        for (let i = 0; i < this.joined.length; i++) {
          console.log('Is in joined: ' + this.joined[i].name);

          const joinedType = this.joined[i].type;

          if (joinedType.includes('subgroup')) {
            console.log('Is subgroup: ' + this.joined[i].name);

            if (this.joined[i].group_id === groupID) {
              console.log('Detected subgroup which is not in free!');
              console.log('Subgroup element: ');
              const saveSubgroup = this.joined[i];
              console.log(saveSubgroup);
              this.free.push(saveSubgroup);
            } else {
              toSplice.push(this.joined[i]);
            }
          } else {
            toSplice.push(this.joined[i]);
          }
        }

        this.joined = toSplice;
      }
    }
  }
}
