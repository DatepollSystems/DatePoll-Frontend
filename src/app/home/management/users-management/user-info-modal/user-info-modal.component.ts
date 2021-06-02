import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {MyUserService} from '../../../my-user.service';
import {GroupsService} from '../../groups-management/groups.service';
import {BadgesService} from '../../performance-badges-management/badges.service';
import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {UsersService} from '../users.service';

import {GroupAndSubgroupModel} from '../../../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';
import {PhoneNumber} from '../../../phoneNumber.model';
import {UserBadge} from '../badges-list/userBadge.model';
import {UserPerformanceBadge} from '../userPerformanceBadge.model';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.css'],
})
export class UserInfoModalComponent implements OnDestroy {
  title: string;
  firstname: string;
  surname: string;
  birthday: Date;
  join_date: Date;

  streetname: string;
  streetnumber: string;
  zipcode: number;
  location: string;

  emailAddresses: string[];
  phoneNumbers: PhoneNumber[] = [];

  activity: string;
  bvMember: string;
  memberNumber: string;

  joined: GroupAndSubgroupModel[] = [];
  joinedSubscription: Subscription;

  username: string;
  activated: boolean;
  internalComment: string;
  informationDenied: boolean;

  userPerformanceBadges: UserPerformanceBadge[];
  userPerformanceBadgesSubscription: Subscription;

  userBadges: UserBadge[];
  userBadgesSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserInfoModalComponent>,
    private myUserService: MyUserService,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private performanceBadgesService: PerformanceBadgesService,
    private badgesService: BadgesService
  ) {
    this.title = data.user.title;
    this.username = data.user.username;
    this.emailAddresses = data.user.getEmailAddresses();
    this.firstname = data.user.firstname;
    this.surname = data.user.surname;
    this.birthday = data.user.birthday;
    this.join_date = data.user.join_date;
    this.streetname = data.user.streetname;
    this.streetnumber = data.user.streetnumber;
    this.zipcode = data.user.zipcode;
    this.location = data.user.location;
    this.activity = data.user.activity;
    this.memberNumber = data.user.memberNumber;
    this.activated = data.user.activated;
    this.bvMember = data.user.bvMember;
    this.internalComment = data.user.internalComment;
    this.informationDenied = data.user.informationDenied;
    this.phoneNumbers = data.user.getPhoneNumbers();

    this.joined = this.usersService.getJoinedOfUser(data.user.id);
    this.joinedSubscription = this.usersService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
    });

    this.userPerformanceBadges = this.performanceBadgesService.getUserPerformanceBadges(data.user.id);
    this.userPerformanceBadgesSubscription = this.performanceBadgesService.userPerformanceBadgesChange.subscribe((value) => {
      this.userPerformanceBadges = value;
    });

    this.userBadges = this.badgesService.getUserBadges(data.user.id);
    this.userBadgesSubscription = this.badgesService.userBadgesChange.subscribe((value) => {
      this.userBadges = value;
    });
  }

  ngOnDestroy() {
    this.joinedSubscription.unsubscribe();
    this.userPerformanceBadgesSubscription.unsubscribe();
  }
}
