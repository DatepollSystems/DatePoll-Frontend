import {Injectable} from '@angular/core';
import {EventStandardDecision} from './models/standardDecision.model';
import {Subject} from 'rxjs';
import {HttpService} from '../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class StandardDecisionsService {

  public standardDecisionsChange: Subject<EventStandardDecision[]> = new Subject<EventStandardDecision[]>();
  private _standardDecisions: EventStandardDecision[] = [];

  constructor(private httpService: HttpService) {
  }

  public getStandardDecisions(): EventStandardDecision[] {
    this.fetchStandardDecisions();
    return this._standardDecisions.slice();
  }

  public fetchStandardDecisions() {
    this.httpService.loggedInV1GETRequest('/avent/administration/standardDecision', 'fetchStandardDecisions').subscribe(
      (response: any) => {
        console.log(response);

        const standardDecisions = [];

        for (let i = 0; i < response.standardDecisions.length; i++) {
          const localStandardDecision = response.standardDecisions[i];

          standardDecisions.push(new EventStandardDecision(localStandardDecision.id, localStandardDecision.decision));
        }

        this.setStandardDecisions(standardDecisions);
      },
      (error) => console.log(error)
    );
  }

  public addStandardDecision(decision: string) {
    const dto = {
      'decision': decision
    };
    return this.httpService.loggedInV1POSTRequest('/avent/administration/standardDecision', dto, 'addStandardDecision');
  }

  public removeStandardDecision(id: number) {
    return this.httpService.loggedInV1DELETERequest('/avent/administration/standardDecision/' + id, 'removeStandardDecision');
  }

  private setStandardDecisions(standardDecisions: EventStandardDecision[]) {
    this._standardDecisions = standardDecisions;
    this.standardDecisionsChange.next(this._standardDecisions.slice());
  }
}
