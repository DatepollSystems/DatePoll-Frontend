import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpService} from '../../../utils/http.service';
import {EventStandardLocation} from '../models/event-standard-location.model';

@Injectable({
  providedIn: 'root',
})
export class StandardLocationsService {
  public standardLocationsChange: Subject<EventStandardLocation[]> = new Subject<EventStandardLocation[]>();
  private _standardLocations: EventStandardLocation[] = [];

  constructor(private httpService: HttpService) {}

  public getStandardLocations(): EventStandardLocation[] {
    this.fetchStandardLocations();
    return this._standardLocations.slice();
  }

  public fetchStandardLocations() {
    this.httpService.loggedInV1GETRequest('/avent/administration/standardLocation', 'fetchStandardLocation').subscribe(
      (response: any) => {
        console.log(response);

        const standardLocations = [];

        for (let i = 0; i < response.standardLocations.length; i++) {
          const localStandardLocation = response.standardLocations[i];

          standardLocations.push(
            new EventStandardLocation(
              localStandardLocation.id,
              localStandardLocation.location,
              localStandardLocation.x,
              localStandardLocation.y,
              localStandardLocation.name
            )
          );
        }

        this.setStandardLocations(standardLocations);
      },
      (error) => console.log(error)
    );
  }

  public addStandardLocation(location: string, x: number, y: number, name: string) {
    const dto = {
      name: name,
      location: location,
      x: x,
      y: y,
    };
    return this.httpService.loggedInV1POSTRequest('/avent/administration/standardLocation', dto, 'addStandardLocation');
  }

  public removeStandardLocation(id: number) {
    return this.httpService.loggedInV1DELETERequest('/avent/administration/standardLocation/' + id, 'removeStandardLocation');
  }

  private setStandardLocations(standardLocations: EventStandardLocation[]) {
    this._standardLocations = standardLocations;
    this.standardLocationsChange.next(this._standardLocations.slice());
  }
}
