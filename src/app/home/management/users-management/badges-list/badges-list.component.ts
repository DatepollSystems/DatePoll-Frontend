import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {BadgesService} from '../../performance-badges-management/badges.service';
import {Badge} from '../../performance-badges-management/models/badge.model';
import {UserBadge} from './userBadge.model';

@Component({
  selector: 'app-badges-list',
  templateUrl: './badges-list.component.html',
  styleUrls: ['./badges-list.component.css']
})
export class BadgesListComponent implements OnChanges, OnDestroy {
  badges: Badge[];
  badgesSubscription: Subscription;

  @Input()
  joinDate: Date;
  joinDateCopy: Date;

  @Output()
  userBadgesChange = new EventEmitter<UserBadge[]>();

  @Input()
  userBadges: UserBadge[] = [];

  extraBadgeEnabled = false;
  extraBadgeDate: Date = new Date();

  constructor(private badgesService: BadgesService) {
    this.badges = this.badgesService.getBadges();
    this.remakeList();
    this.badgesSubscription = this.badgesService.badgesChange.subscribe(value => {
      this.badges = value;
      this.remakeList();
    });
  }

  ngOnDestroy(): void {
    this.badgesSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.joinDateCopy !== this.joinDate) {
      this.remakeList();
      this.joinDateCopy = this.joinDate;
    }
  }

  remakeList() {
    if (this.badges == null || this.joinDate == null) {
      return;
    }
    const userIsInCommunityYears = new Date().getFullYear() - this.joinDate.getFullYear();
    for (const badge of this.badges) {
      let disabled = false;
      for (const userBadge of this.userBadges) {
        if (userBadge.description.includes(badge.description)) {
          disabled = true;
          badge.disabled = true;
          break;
        }
      }
      if (!disabled) {
        badge.disabled = badge.afterYears > userIsInCommunityYears;
      }
      badge.remainingYears = badge.afterYears - userIsInCommunityYears;
    }
  }

  addBadgeToUser(badge: Badge) {
    const date = new Date(this.joinDate);
    date.setFullYear(date.getFullYear() + badge.afterYears);
    this.userBadges.push(new UserBadge(Math.random(), badge.description, date, null));
    this.userBadgesChange.emit(this.userBadges.slice());
    this.remakeList();
  }

  addExtraBadge(form: NgForm) {
    const description = form.controls.badgeDescription.value;
    const reason = form.controls.badgeReason.value;

    this.userBadges.push(new UserBadge(Math.random(), description, this.extraBadgeDate, reason));
    this.userBadgesChange.emit(this.userBadges.slice());
    form.reset();
    this.extraBadgeEnabled = false;
  }

  removeUserBadge(badge: UserBadge) {
    const index = this.userBadges.indexOf(badge);

    if (index >= 0) {
      this.userBadges.splice(index, 1);
    }
    this.userBadgesChange.emit(this.userBadges.slice());
    this.remakeList();
  }
}
