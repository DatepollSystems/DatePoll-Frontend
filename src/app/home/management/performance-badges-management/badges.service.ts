import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../utils/http.service';
import {Badge} from './models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {
  public badgesChange: Subject<Badge[]> = new Subject<Badge[]>();
  private badges: Badge[];

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
      error => console.log(error)
    );
  }

  public addBadge(description: string, afterYears: number) {
    const dto = {
      description,
      after_years: afterYears
    };

    return this.httpService.loggedInV1POSTRequest('/management/badges', dto, 'addBadge');
  }

  public removeBadge(id: number) {
    return this.httpService.loggedInV1DELETERequest('/management/badges/' + id, 'removeBadge');
  }
}
