import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../utils/http.service';

import {UserBadge} from '../users-management/models/userBadge.model';
import {Badge} from './models/badge.model';
import {Converter} from '../../../utils/helper/Converter';

@Injectable({
  providedIn: 'root',
})
export class BadgesService {
  public badgesChange: Subject<Badge[]> = new Subject<Badge[]>();
  private badges: Badge[];

  public userBadgesChange: Subject<UserBadge[]> = new Subject<UserBadge[]>();
  private userBadges: UserBadge[] = [];

  constructor(private httpService: HttpService) {}

  public setBadges(badges: Badge[]) {
    this.badges = badges;
    this.badgesChange.next(this.badges.slice());
  }

  public getBadges(): Badge[] {
    this.fetchBadges();

    if (this.badges == null) {
      return null;
    }

    return this.badges.slice();
  }

  public fetchBadges() {
    this.httpService.loggedInV1GETRequest('/management/badges', 'fetchBadges').subscribe(
      (data: any) => {
        console.log(data);

        const badgesToSave = [];
        for (const badge of data.badges) {
          badgesToSave.push(new Badge(badge.id, badge.description, badge.afterYears));
        }

        this.setBadges(badgesToSave);
      },
      (error) => console.log(error)
    );
  }

  public addBadge(description: string, afterYears: number) {
    const dto = {
      description,
      after_years: afterYears,
    };

    return this.httpService.loggedInV1POSTRequest('/management/badges', dto, 'addBadge');
  }

  public removeBadge(id: number) {
    return this.httpService.loggedInV1DELETERequest('/management/badges/' + id, 'removeBadge');
  }

  public addBadgeToUser(description: string, getDate: Date, reason: string, userId: number) {
    const dto = {
      description,
      get_date: Converter.getDateFormatted(getDate),
      reason,
      user_id: userId,
    };
    return this.httpService.loggedInV1POSTRequest('/management/badgeForUser', dto, 'addBadgeForUser');
  }

  public getUserBadges(id: number): UserBadge[] {
    this.fetchUserBadges(id);
    return this.userBadges.slice();
  }

  public fetchUserBadges(id: number) {
    this.httpService.loggedInV1GETRequest('/management/badgesForUser/' + id, 'fetchUserBadges').subscribe((response: any) => {
      console.log(response);
      const badgesToSave = [];
      for (const badge of response.userBadges) {
        badgesToSave.push(new UserBadge(badge.id, badge.description, Converter.getIOSDate(badge.get_date), badge.reason));
      }

      this.setUserBadges(badgesToSave);
    });
  }

  private setUserBadges(userBadges: UserBadge[]) {
    this.userBadges = userBadges;
    this.userBadgesChange.next(this.userBadges.slice());
  }

  public removeBadgeFromUser(id: number) {
    return this.httpService.loggedInV1DELETERequest('/management/badgeForUser/' + id, 'removeBadgeFromUser');
  }
}
