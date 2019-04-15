import {Component, Inject, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {Subscription} from 'rxjs';

import {UsersService} from '../users.service';
import {GroupsService} from '../../groups-management/groups.service';
import {PhoneNumber} from '../../../phoneNumber.model';
import {User} from '../user.model';

@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.css']
})
export class UserUpdateModalComponent implements OnDestroy {

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  sendingRequest = false;

  user: User;

  title: string;
  firstname: string;
  surname: string;
  email: string;
  birthday: Date;
  join_date: Date;

  streetname: string;
  streetnumber: string;
  zipcode: number;
  location: string;
  activity: string;
  activated: boolean;

  phoneNumberCount = 0;
  phoneNumbers: PhoneNumber[] = [];

  joinedCopy: any[] = [];
  joined: any[] = [];
  joinedSubscription: Subscription;

  freeCopy: any[] = [];
  free: any[] = [];
  freeSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserUpdateModalComponent>,
    private groupsService: GroupsService,
    private usersService: UsersService) {

    this.user = data.user;
    this.title = this.user.title;
    this.firstname = this.user.firstname;
    this.surname = this.user.surname;
    this.email = this.user.email;
    this.birthday = this.user.birthday;
    this.join_date = this.user.join_date;
    this.streetname = this.user.streetname;
    this.streetnumber = this.user.streetnumber;
    this.zipcode = this.user.zipcode;
    this.location = this.user.location;
    this.activity = this.user.activity;
    this.activated = this.user.activated;
    this.phoneNumbers = this.user.getPhoneNumbers();

    this.dataSource = new MatTableDataSource(this.phoneNumbers);

    this.joined = this.usersService.getJoinedOfUser(this.user.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.usersService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();

      setTimeout(function () {
        document.getElementById('joined-list').style.height = document.getElementById('free-list').clientHeight.toString() + 'px';
        console.log('Free hight:' + document.getElementById('free-list').clientHeight);
        console.log('Joined hight:' + document.getElementById('joined-list').clientHeight);
      }, 1000);
    });

    this.free = this.usersService.getFreeOfUser(this.user.id);
    this.freeCopy = this.free.slice();
    this.freeSubscription = this.usersService.freeGroupsChange.subscribe((value) => {
      this.free = value;
      this.freeCopy = this.free.slice();

      setTimeout(function () {
        document.getElementById('free-list').style.height = document.getElementById('joined-list').clientHeight.toString() + 'px';
        console.log('Free hight:' + document.getElementById('free-list').clientHeight);
        console.log('Joined hight:' + document.getElementById('joined-list').clientHeight);
      }, 1000);
    });
  }

  ngOnDestroy() {
    this.joinedSubscription.unsubscribe();
    this.freeSubscription.unsubscribe();
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

  update(form: NgForm) {
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

    console.log('update User | title: ' + title);
    console.log('update User | email: ' + email);
    console.log('update User | firstname: ' + firstname);
    console.log('update User | surname: ' + surname);
    console.log('update User | birthday: ' + birthdayformatted);
    console.log('update User | join_date: ' + join_dateformatted);
    console.log('update User | streetname: ' + streetname);
    console.log('update User | streetnumber: ' + streetnumber);
    console.log('update User | zipcode: ' + zipcode);
    console.log('update User | location: ' + location);
    console.log('update User | activity: ' + activity);
    console.log('update User | activated: ' + activated);

    for (let i = 0; i < this.joined.length; i++) {
      const group = this.joined[i];

      let toUpdate = true;

      for (let j = 0; j < this.joinedCopy.length; j++) {
        if (group.type.includes(this.joinedCopy[j].type)) {
          if (group.id === this.joinedCopy[j].id) {
            toUpdate = false;
            console.log('toUpdate | joined | false | ' + group.name + ' | ' + this.joinedCopy[j].name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | joined | true | ' + group.name);

        if (group.type.includes('parentgroup')) {
          this.groupsService.addUserToGroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.groupsService.addUserToSubgroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

    for (let i = 0; i < this.free.length; i++) {
      const group = this.free[i];

      let toUpdate = true;

      for (let j = 0; j < this.freeCopy.length; j++) {
        if (group.type.includes(this.freeCopy[j].type)) {
          if (group.id === this.freeCopy[j].id) {
            toUpdate = false;
            console.log('toUpdate | free | false | ' + group.name + ' | ' + this.freeCopy[j].name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | free | true | ' + group.name);

        if (group.type.includes('parentgroup')) {
          this.groupsService.removeUserFromGroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.groupsService.removeUserFromSubgroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

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
      'phoneNumbers': phoneNumbersObject
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

    this.usersService.updateUser(this.user.id, userObject).subscribe(
      (data: any) => {
        console.log(data);
        this.usersService.fetchUsers();
        this.dialogRef.close();
      },
      (error) => {
        console.log(error);
        this.usersService.fetchUsers();
        this.dialogRef.close();
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
