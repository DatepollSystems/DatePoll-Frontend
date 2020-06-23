import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../utils/converter';
import {HttpService} from '../../../utils/http.service';
import {Broadcast, UserBroadcastInfo} from '../models/broadcast.model';

@Injectable({
  providedIn: 'root'
})
export class BroadcastsAdministrationService {
  private _broadcasts: Broadcast[] = [];
  public broadcastsChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();

  private broadcast: Broadcast;
  public broadcastChange = new Subject<Broadcast>();

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

  public getSentReceiptBroadcast(id: number) {
    this.fetchSentReceiptBroadcast(id);
    return this.broadcast;
  }

  public fetchSentReceiptBroadcast(id: number) {
    this.httpService.loggedInV1GETRequest('/broadcast/administration/broadcast/' + id, 'fetchSentReceiptBroadcast').subscribe(
      (response: any) => {
        console.log(response);

        const userInfos = [];
        for (const userInfo of response.broadcast.users_info) {
          userInfos.push(
            new UserBroadcastInfo(
              userInfo.user_name,
              userInfo.sent,
              Converter.getIOSDate(userInfo.created_at),
              Converter.getIOSDate(userInfo.updated_at)
            )
          );
        }

        const broadcast = response.broadcast;
        const toSaveBroadcast = new Broadcast(
          broadcast.id,
          broadcast.subject,
          Converter.getIOSDate(broadcast.created_at),
          broadcast.body,
          broadcast.writer_name
        );
        toSaveBroadcast.groups = broadcast.groups;
        toSaveBroadcast.subgroups = broadcast.subgroups;
        toSaveBroadcast.forEveryone = broadcast.for_everyone;
        toSaveBroadcast.bodyHTML = broadcast.bodyHTML;
        toSaveBroadcast.userInfos = userInfos;
        this.setBroadcast(toSaveBroadcast);
      },
      error => console.log(error)
    );
  }

  private setBroadcast(broadcast: Broadcast) {
    this.broadcast = broadcast;
    this.broadcastChange.next(this.broadcast);
  }

  public deleteBroadcast(id: number) {
    return this.httpService.loggedInV1DELETERequest('/broadcast/administration/broadcast/' + id, 'deleteBroadcast');
  }
}
