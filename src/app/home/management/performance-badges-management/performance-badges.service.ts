import { Injectable } from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Instrument} from './instrument.model';
import {Subject} from 'rxjs';
import {PerformanceBadge} from './performanceBadge.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceBadgesService {

  private performanceBadges: PerformanceBadge[];
  public performanceBadgesChange: Subject<PerformanceBadge[]> = new Subject<PerformanceBadge[]>();

  private instruments: Instrument[];
  public instrumentsChange: Subject<Instrument[]> = new Subject<Instrument[]>();

  constructor(private httpService: HttpService) { }

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
}
