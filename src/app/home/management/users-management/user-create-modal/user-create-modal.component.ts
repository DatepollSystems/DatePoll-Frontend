import {Component, OnDestroy} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgForm} from '@angular/forms';
import {MatDialogRef, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {UsersService} from '../users.service';
import {GroupsService} from '../../groups-management/groups.service';

import {PhoneNumber} from '../../../phoneNumber.model';
import {Group} from '../../groups-management/group.model';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.css']
})
export class UserCreateModalComponent implements OnDestroy {

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

  constructor(private usersService: UsersService, private dialogRef: MatDialogRef<UserCreateModalComponent>,
              private groupsService: GroupsService) {
    this.dataSource = new MatTableDataSource(this.phoneNumbers);

    this.groups = this.groupsService.getGroups();
    this.remakeFreeAndJoinedList();
    this.groupsSubscription = this.groupsService.groupsChange.subscribe((value) => {
      this.groups = value;
      this.remakeFreeAndJoinedList();
    });
  }

  ngOnDestroy() {
    this.groupsSubscription.unsubscribe();
  }

  remakeFreeAndJoinedList() {
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
      console.log('Free hight:' + document.getElementById('free-list').clientHeight);
      console.log('Joined hight:' + document.getElementById('joined-list').clientHeight);
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

  create(form: NgForm) {
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

    this.sendingRequest = true;

    this.usersService.addUser(userObject).subscribe(
      (data: any) => {
        console.log(data);

        console.log('create User | User created!');

        if (this.joined.length > 0) {
          console.log('create User | Adding user to groups and subgroups');

          const userID = data.user.id;
          console.log('create User | Userid: ' + userID);

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
