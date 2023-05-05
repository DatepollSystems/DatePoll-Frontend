import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../utils/helper/Converter';
import {HttpService} from '../../../utils/http.service';
import {Broadcast, UserBroadcastInfo} from '../models/broadcast.model';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AHasYears} from '../../../utils/HasYears/AHasYears';

@Injectable({
  providedIn: 'root',
})
export class BroadcastsAdministrationService extends AHasYears {
  apiUrl = environment.apiUrl;

  private _broadcasts: Broadcast[] = [];
  public broadcastsChange: Subject<Broadcast[]> = new Subject<Broadcast[]>();

  private broadcast: Broadcast;
  public broadcastChange = new Subject<Broadcast>();

  constructor(httpService: HttpService, private httpClient: HttpClient) {
    super(httpService, '/broadcast/administration/broadcast/years');
  }

  public getBroadcasts(year: number): Broadcast[] {
    this._lastUsedYear = year;
    this.fetchBroadcasts(year);
    return this._broadcasts.slice();
  }

  public setBroadcasts(broadcasts: Broadcast[]) {
    this._broadcasts = broadcasts;
    this.broadcastsChange.next(this._broadcasts.slice());
  }

  public fetchBroadcasts(year: number = null) {
    if (this._lastUsedYear != null) {
      year = this._lastUsedYear;
    }
    let url = '/broadcast/administration/broadcast';
    if (year != null) {
      url += '/' + year;
    } else {
      url += '/null';
    }

    this.httpService.loggedInV1GETRequest(url, 'fetchAdminBroadcasts').subscribe(
      (response: any) => {
        console.log(response);

        const broadcasts = [];
        for (const broadcast of response.data) {
          const toSaveBroadcast = Broadcast.createOfDTO(broadcast);

          broadcasts.push(toSaveBroadcast);
        }
        this.setBroadcasts(broadcasts);
      },
      (error) => console.log(error)
    );
  }

  public createBroadcast(broadcast: any) {
    return this.httpService.loggedInV1POSTRequest('/broadcast/administration/broadcast', broadcast, 'createBroadcast');
  }

  public requeueNotSentBroadcastMails(id: number) {
    return this.httpService.loggedInV1PUTRequest('/broadcast/administration/broadcast/' + id, null, 'requeueNotSentBroadcastMails');
  }

  public getSentReceiptBroadcast(id: number) {
    this.fetchSentReceiptBroadcast(id);
    return this.broadcast;
  }

  public fetchSentReceiptBroadcast(id: number) {
    this.httpService.loggedInV1GETRequest('/broadcast/administration/single/' + id, 'fetchSentReceiptBroadcast').subscribe(
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
        const toSaveBroadcast = Broadcast.createOfDTO(broadcast);
        toSaveBroadcast.groups = broadcast.groups;
        toSaveBroadcast.subgroups = broadcast.subgroups;
        toSaveBroadcast.attachments = broadcast.attachments;
        toSaveBroadcast.forEveryone = broadcast.for_everyone;
        toSaveBroadcast.bodyHTML = broadcast.bodyHTML;
        toSaveBroadcast.userInfos = userInfos;
        this.setBroadcast(toSaveBroadcast);
      },
      (error) => console.log(error)
    );
  }

  private setBroadcast(broadcast: Broadcast) {
    this.broadcast = broadcast;
    this.broadcastChange.next(this.broadcast);
  }

  public deleteBroadcast(id: number) {
    return this.httpService.loggedInV1DELETERequest('/broadcast/administration/broadcast/' + id, 'deleteBroadcast');
  }

  public uploadAttachments(data) {
    const uploadURL = this.apiUrl + '/v1/broadcast/administration/attachment';

    return this.httpClient
      .post<any>(uploadURL, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return {status: 'progress', message: progress};

            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }

  public deleteAttachment(attachmentId: number) {
    return this.httpService.loggedInV1DELETERequest('/broadcast/administration/attachment/' + attachmentId, 'deleteAttachment');
  }
}
