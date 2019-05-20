import {Injectable} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Instrument} from './instrument.model';
import {Subject} from 'rxjs';
import {PerformanceBadge} from './performanceBadge.model';
import {UserPerformanceBadge} from '../users-management/userPerformanceBadge.model';
import {User} from '../users-management/user.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceBadgesService {

  private performanceBadges: PerformanceBadge[];
  public performanceBadgesChange: Subject<PerformanceBadge[]> = new Subject<PerformanceBadge[]>();

  private instruments: Instrument[];
  public instrumentsChange: Subject<Instrument[]> = new Subject<Instrument[]>();

  private userPerformanceBadges: UserPerformanceBadge[] = [];
  public userPerformanceBadgesChange: Subject<UserPerformanceBadge[]> = new Subject<UserPerformanceBadge[]>();

  constructor(private httpService: HttpService) {
  }

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

        const performanceBadges = data.performanceBadges;
        for (let i = 0; i < performanceBadges.length; i++) {
          performanceBadgesToSave.push(new PerformanceBadge(performanceBadges[i].id, performanceBadges[i].name));
        }

        this.setPerformanceBadges(performanceBadgesToSave);
      },
      (error) => console.log(error)
    );
  }

  public addPerformanceBadge(name: string) {
    const dto = {
      'name': name
    };

    return this.httpService.loggedInV1POSTRequest('/management/performanceBadges', dto, 'addPerformanceBadge');
  }

  public updatePerformanceBadge(id: number, name: string) {
    const dto = {
      'name': name
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

        const instruments = data.instruments;
        for (let i = 0; i < instruments.length; i++) {
          instrumentsToSave.push(new Instrument(instruments[i].id, instruments[i].name));
        }

        this.setInstruments(instrumentsToSave);
      },
      (error) => console.log(error)
    );
  }

  public addInstrument(name: string) {
    const dto = {
      'name': name
    };

    return this.httpService.loggedInV1POSTRequest('/management/instruments', dto, 'addInstrument');
  }

  public updateInstrument(id: number, name: string) {
    const dto = {
      'name': name
    };
    return this.httpService.loggedInV1PUTRequest('/management/instruments/' + id, dto, 'updateInstrument');
  }

  public removeInstrument(id: number) {
    return this.httpService.loggedInV1DELETERequest('/management/instruments/' + id, 'removeInstrument');
  }


  public addUserHasPerformanceBadgeWithInstrument(userId: number, userPerformanceBadge: UserPerformanceBadge) {
    const d = new Date(userPerformanceBadge.date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    const dateFormatted = [year, month, day].join('-');

    const dto = {
      'user_id': userId,
      'instrument_id': userPerformanceBadge.instrumentId,
      'performanceBadge_id': userPerformanceBadge.performanceBadgeId,
      'date': dateFormatted,
      'grade': userPerformanceBadge.grade,
      'note': userPerformanceBadge.note
    };

    return this.httpService.loggedInV1POSTRequest('/management/performanceBadgeWithInstrument', dto,
      'addUserHasPerformanceBadgeWithInstrument');
  }

  public removeUserHasPerformanceBadgeWithInstrument(userPerformanceBadgeId: number) {
    return this.httpService.loggedInV1DELETERequest('/management/performanceBadgeWithInstrument/' + userPerformanceBadgeId,
      'removeUserHasPerformanceBadgeWithInstrument');
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
        const userPerformanceBadges = data.performanceBadges;
        for (let i = 0; i < userPerformanceBadges.length; i++) {
          const userPerformanceBadge = userPerformanceBadges[i];
          userPerformanceBadgesToSave.push(new UserPerformanceBadge(userPerformanceBadge.id, userPerformanceBadge.performanceBadge_id,
            userPerformanceBadge.instrument_id, userPerformanceBadge.performanceBadge_name, userPerformanceBadge.instrument_name,
            userPerformanceBadge.date, userPerformanceBadge.grade, userPerformanceBadge.note));
        }

        this.setUserPerformanceBadges(userPerformanceBadgesToSave);
      },
      (error) => console.log(error)
    );
  }

  private setUserPerformanceBadges(userPerformanceBadges: UserPerformanceBadge[]) {
    this.userPerformanceBadges = userPerformanceBadges;
    this.userPerformanceBadgesChange.next(this.userPerformanceBadges.slice());
  }
}
