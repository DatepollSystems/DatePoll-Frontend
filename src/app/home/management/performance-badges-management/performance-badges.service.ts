import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../utils/converter';
import {HttpService} from '../../../utils/http.service';

import {UserPerformanceBadge} from '../users-management/userPerformanceBadge.model';
import {CurrentYearBadge, CurrentYearUser} from './models/currentYearUser.model';
import {Instrument} from './models/instrument.model';
import {PerformanceBadge} from './models/performanceBadge.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceBadgesService {
  public performanceBadgesChange: Subject<PerformanceBadge[]> = new Subject<PerformanceBadge[]>();
  public instrumentsChange: Subject<Instrument[]> = new Subject<Instrument[]>();
  public userPerformanceBadgesChange: Subject<UserPerformanceBadge[]> = new Subject<UserPerformanceBadge[]>();
  public currentYearUsersChange: Subject<CurrentYearUser[]> = new Subject<CurrentYearUser[]>();
  private performanceBadges: PerformanceBadge[];
  private instruments: Instrument[];
  private userPerformanceBadges: UserPerformanceBadge[] = [];
  private currentYearUsers: CurrentYearUser[];

  constructor(private httpService: HttpService) {}

  public setPerformanceBadges(performanceBadges: PerformanceBadge[]) {
    this.performanceBadges = performanceBadges;
    this.performanceBadgesChange.next(this.performanceBadges.slice());
  }

  public getPerformanceBadges(): PerformanceBadge[] {
    this.fetchPerformanceBadges();

    if (this.performanceBadges == null) {
      return null;
    }

    return this.performanceBadges.slice();
  }

  public fetchPerformanceBadges() {
    this.httpService.loggedInV1GETRequest('/management/performanceBadges', 'fetchPerformanceBadges').subscribe(
      (data: any) => {
        console.log(data);

        const performanceBadgesToSave = [];

        for (const performanceBadge of data.performanceBadges) {
          performanceBadgesToSave.push(new PerformanceBadge(performanceBadge.id, performanceBadge.name));
        }

        this.setPerformanceBadges(performanceBadgesToSave);
      },
      error => console.log(error)
    );
  }

  public addPerformanceBadge(name: string) {
    const dto = {
      name
    };

    return this.httpService.loggedInV1POSTRequest('/management/performanceBadges', dto, 'addPerformanceBadge');
  }

  public updatePerformanceBadge(id: number, name: string) {
    const dto = {
      name
    };
    return this.httpService.loggedInV1PUTRequest('/management/performanceBadges/' + id, dto, 'updatePerformanceBadge');
  }

  public removePerformanceBadge(id: number) {
    return this.httpService.loggedInV1DELETERequest('/management/performanceBadges/' + id, 'removePerformanceBadge');
  }

  public setInstruments(instruments: Instrument[]) {
    this.instruments = instruments;
    this.instrumentsChange.next(this.instruments.slice());
  }

  public getInstruments(): Instrument[] {
    this.fetchInstruments();
    if (this.instruments == null) {
      return null;
    }

    return this.instruments.slice();
  }

  public fetchInstruments() {
    this.httpService.loggedInV1GETRequest('/management/instruments', 'fetchInstruments').subscribe(
      (data: any) => {
        console.log(data);

        const instrumentsToSave = [];

        for (const instrument of data.instruments) {
          instrumentsToSave.push(new Instrument(instrument.id, instrument.name));
        }

        this.setInstruments(instrumentsToSave);
      },
      error => console.log(error)
    );
  }

  public addInstrument(name: string) {
    const dto = {
      name
    };

    return this.httpService.loggedInV1POSTRequest('/management/instruments', dto, 'addInstrument');
  }

  public updateInstrument(id: number, name: string) {
    const dto = {
      name
    };
    return this.httpService.loggedInV1PUTRequest('/management/instruments/' + id, dto, 'updateInstrument');
  }

  public removeInstrument(id: number) {
    return this.httpService.loggedInV1DELETERequest('/management/instruments/' + id, 'removeInstrument');
  }

  public addUserHasPerformanceBadgeWithInstrument(userId: number, userPerformanceBadge: UserPerformanceBadge) {
    const dto = {
      user_id: userId,
      instrument_id: userPerformanceBadge.instrumentId,
      performanceBadge_id: userPerformanceBadge.performanceBadgeId,
      date: Converter.getDateFormatted(userPerformanceBadge.date),
      grade: userPerformanceBadge.grade,
      note: userPerformanceBadge.note
    };

    return this.httpService.loggedInV1POSTRequest(
      '/management/performanceBadgeWithInstrument',
      dto,
      'addUserHasPerformanceBadgeWithInstrument'
    );
  }

  public removeUserHasPerformanceBadgeWithInstrument(userPerformanceBadgeId: number) {
    return this.httpService.loggedInV1DELETERequest(
      '/management/performanceBadgeWithInstrument/' + userPerformanceBadgeId,
      'removeUserHasPerformanceBadgeWithInstrument'
    );
  }

  public getUserPerformanceBadges(userId: number): UserPerformanceBadge[] {
    this.fetchUserPerformanceBadges(userId);
    return this.userPerformanceBadges.slice();
  }

  private fetchUserPerformanceBadges(userId: number) {
    this.httpService.loggedInV1GETRequest('/management/performanceBadgesForUser/' + userId, 'fetchUserPerformanceBadges').subscribe(
      (data: any) => {
        console.log(data);

        const userPerformanceBadgesToSave = [];
        for (const userPerformanceBadge of data.performanceBadges) {
          userPerformanceBadgesToSave.push(
            new UserPerformanceBadge(
              userPerformanceBadge.id,
              userPerformanceBadge.performanceBadge_id,
              userPerformanceBadge.instrument_id,
              userPerformanceBadge.performanceBadge_name,
              userPerformanceBadge.instrument_name,
              userPerformanceBadge.date,
              userPerformanceBadge.grade,
              userPerformanceBadge.note
            )
          );
        }

        this.setUserPerformanceBadges(userPerformanceBadgesToSave);
      },
      error => console.log(error)
    );
  }

  private setUserPerformanceBadges(userPerformanceBadges: UserPerformanceBadge[]) {
    this.userPerformanceBadges = userPerformanceBadges;
    this.userPerformanceBadgesChange.next(this.userPerformanceBadges.slice());
  }

  private setCurrentYearUsers(currentYearUsers: CurrentYearUser[]) {
    this.currentYearUsers = currentYearUsers.slice();
    this.currentYearUsersChange.next(this.currentYearUsers.slice());
  }

  public fetchCurrentYearUsers() {
    this.httpService.loggedInV1GETRequest('/management/currentYearBadges', 'fetchCurrentYearUsers').subscribe(
      (response: any) => {
        console.log(response);

        const usersToSave = [];
        for (const user of response.users) {
          const userToSave = new CurrentYearUser(user.id, user.firstname, user.surname, Converter.getIOSDate(user.join_date));
          const yearBadgesToSave = [];
          for (const badge of user.current_year_badges) {
            yearBadgesToSave.push(new CurrentYearBadge(badge.id, badge.description, badge.afterYears));
          }
          userToSave.currentYearBadges = yearBadgesToSave;
          usersToSave.push(userToSave);

          this.setCurrentYearUsers(usersToSave);
        }
      },
      error => console.log(error)
    );
  }

  public getCurrentYearUsers(): CurrentYearUser[] {
    this.fetchCurrentYearUsers();

    if (this.performanceBadges == null) {
      return null;
    }

    return this.currentYearUsers.slice();
  }
}
