import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../utils/converter';
import {HttpService} from '../../../utils/http.service';
import {Broadcast} from '../models/broadcast.model';

@Injectable({
  providedIn: 'root'
})
export class BroadcastsAdministrationService {
  private _broadcasts: Broadcast[] = [];
  public broadcastsChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();

  constructor(private httpService: HttpService) {}

  public getBroadcasts(): Broadcast[] {
    this.fetchBroadcasts();
    return this._broadcasts.slice();
  }

  public setBroadcasts(broadcasts: Broadcast[]) {
    this._broadcasts = broadcasts;
    this.broadcastsChange.next(this._broadcasts.slice());
  }

  public fetchBroadcasts() {
    this.httpService.loggedInV1GETRequest('/broadcast/administration/broadcast', 'fetchAdminBroadcasts').subscribe(
      (response: any) => {
        console.log(response);

        const broadcasts = [];
        for (const broadcast of response.broadcasts) {
          const toSaveBroadcast = new Broadcast(
            broadcast.id,
            broadcast.subject,
            Converter.getIOSDate(broadcast.created_at),
            broadcast.body,
            broadcast.writer_name
          );
          toSaveBroadcast.groups = broadcast.groups;
          toSaveBroadcast.subgroups = broadcast.subgroups;

          broadcasts.push(toSaveBroadcast);
        }
        this.setBroadcasts(broadcasts);
      },
      error => console.log(error)
    );
  }

  public createBroadcast(broadcast: any) {
    return this.httpService.loggedInV1POSTRequest('/broadcast/administration/broadcast', broadcast, 'createBroadcast');
  }
}
