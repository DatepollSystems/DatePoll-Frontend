import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../utils/converter';
import {HttpService} from '../../utils/http.service';

import {Broadcast} from './models/broadcast.model';

@Injectable({
  providedIn: 'root',
})
export class BroadcastsService {
  private _broadcasts: Broadcast[] = [];
  public broadcastsChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();

  private broadcast: Broadcast;
  public broadcastChange = new Subject<Broadcast>();

  constructor(private httpService: HttpService) {}

  public getBroadcasts(): Broadcast[] {
    this.fetchBroadcasts();
    return this._broadcasts.slice();
  }

  private setBroadcasts(broadcasts: Broadcast[]) {
    this._broadcasts = broadcasts;
    this.broadcastsChange.next(this._broadcasts.slice());
  }

  public fetchBroadcasts() {
    this.httpService.loggedInV1GETRequest('/broadcast', 'fetchBroadcasts').subscribe(
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
          toSaveBroadcast.forEveryone = broadcast.for_everyone;

          broadcasts.push(toSaveBroadcast);
        }
        this.setBroadcasts(broadcasts);
      },
      (error) => console.log(error)
    );
  }

  public getBroadcast(id: number) {
    this.fetchBroadcast(id);
    return this.broadcast;
  }

  public fetchBroadcast(id: number) {
    this.httpService.loggedInV1GETRequest('/broadcast/' + id, 'fetchBroadcast').subscribe(
      (response: any) => {
        console.log(response);

        const broadcast = response.broadcast;
        const toSaveBroadcast = new Broadcast(
          broadcast.id,
          broadcast.subject,
          Converter.getIOSDate(broadcast.created_at),
          broadcast.body,
          broadcast.writer_name
        );
        toSaveBroadcast.forEveryone = broadcast.for_everyone;
        toSaveBroadcast.groups = broadcast.groups;
        toSaveBroadcast.subgroups = broadcast.subgroups;
        toSaveBroadcast.attachments = broadcast.attachments;
        toSaveBroadcast.bodyHTML = broadcast.bodyHTML;
        this.setBroadcast(toSaveBroadcast);
      },
      (error) => console.log(error)
    );
  }

  private setBroadcast(broadcast: Broadcast) {
    this.broadcast = broadcast;
    this.broadcastChange.next(this.broadcast);
  }
}
