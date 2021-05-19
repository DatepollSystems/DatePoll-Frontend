import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../utils/helper/Converter';
import {HttpService} from '../../utils/http.service';

import {Broadcast} from './models/broadcast.model';
import {UserChange} from '../management/users-management/users-changes-management/userChange.model';

@Injectable({
  providedIn: 'root',
})
export class BroadcastsService {
  private _broadcasts: Broadcast[] = [];
  public broadcastsChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();

  private _broadcastsSearched: Broadcast[] = [];
  public broadcastsSearchedChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();

  private broadcast: Broadcast;
  public broadcastChange = new Subject<Broadcast>();

  constructor(private httpService: HttpService) {}

  public getBroadcasts(page: number = 0): Broadcast[] {
    this.fetchBroadcasts(page);
    return this._broadcasts.slice();
  }

  private setBroadcasts(broadcasts: Broadcast[]) {
    this._broadcasts = broadcasts;
    this.broadcastsChange.next(this._broadcasts.slice());
  }

  public fetchBroadcasts(page: number = 0) {
    this.httpService.loggedInV1GETRequest('/broadcast/all/' + page + '/35', 'fetchBroadcasts').subscribe(
      (response: any) => {
        console.log(response);

        const broadcasts = [];
        for (const broadcast of response.broadcasts) {
          const toSaveBroadcast = Broadcast.createOfDTO(broadcast);
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
        const toSaveBroadcast = Broadcast.createOfDTO(broadcast);
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

  public searchBroadcast(search: string): Broadcast[] {
    this.fetchSearchUserChanges(search);
    return this._broadcastsSearched.slice();
  }

  private fetchSearchUserChanges(search: string) {
    const dto = {
      search,
    };
    this.httpService.loggedInV1POSTRequest('/broadcast/search', dto, 'fetchBroadcastSearch').subscribe(
      (response: any) => {
        console.log(response);
        const broadcasts = [];
        for (const broadcast of response.broadcasts) {
          const toSaveBroadcast = Broadcast.createOfDTO(broadcast);
          toSaveBroadcast.forEveryone = broadcast.for_everyone;

          broadcasts.push(toSaveBroadcast);
        }
        this.setSearchedBroadcasts(broadcasts);
      },
      (error) => console.log(error)
    );
  }

  private setSearchedBroadcasts(searchBroadcasts: Broadcast[]) {
    this._broadcastsSearched = searchBroadcasts;
    this.broadcastsSearchedChange.next(this._broadcastsSearched.slice());
  }
}
