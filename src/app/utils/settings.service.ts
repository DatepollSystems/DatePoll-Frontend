import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

import {HttpService} from './http.service';

import {ServerInfoModel} from './server-info.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public openWeatherMapKeyChange: Subject<string> = new Subject<string>();
  public openWeatherMapCinemaCityIdChange: Subject<string> = new Subject<string>();
  private _openWeatherMapKey = '';
  private _openWeatherMapCinemaCityId = '';
  public alertChange: Subject<any> = new Subject<any>();
  private _alert: any;
  public broadcastIncomingMailForwardingEmailAddressesChange: Subject<string[]> = new Subject<string[]>();
  private _broadcastIncomingMailForwardingEmailAddresses: string[] = [];
  public jitsiMeetInstanceUrlChange: Subject<string> = new Subject<string>();
  private _jitsiMeetInstanceUrl: string;

  public serverInfoChange: Subject<ServerInfoModel> = new Subject<ServerInfoModel>();
  private _serverInfo = new ServerInfoModel();

  constructor(private httpService: HttpService, private router: Router, private http: HttpClient) {}

  public getServerInfo(): ServerInfoModel {
    this.fetchServerInfo();
    return this._serverInfo;
  }

  private fetchServerInfo(): void {
    this.http.get<ServerInfoModel>(this.httpService.apiUrl + '/').subscribe((data: ServerInfoModel) => {
      console.log(data);
      this._serverInfo = data;
      this.serverInfoChange.next(this._serverInfo);
    });
  }

  public setAdminShowCinema(showCinema: boolean) {
    this.setShowCinema(showCinema);

    const body = {
      isEnabled: showCinema,
    };

    this.httpService.setSettingsRequest('/cinema', body, 'setCinemaFeatureEnabled').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public setAdminShowEvents(showEvents: boolean) {
    this.setShowEvents(showEvents);

    const body = {
      isEnabled: showEvents,
    };

    this.httpService.setSettingsRequest('/events', body, 'setEventsFeatureEnabled').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public setAdminShowBroadcasts(showBroadcasts: boolean) {
    this.setShowBroadcasts(showBroadcasts);

    const body = {
      isEnabled: showBroadcasts,
    };

    this.httpService.setSettingsRequest('/broadcast', body, 'setBroadcastFeatureEnabled').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public setAdminBroadcastProcessIncomingMails(processIncomingMails: boolean) {
    this.setBroadcastProcessIncomingMails(processIncomingMails);

    const body = {
      isEnabled: processIncomingMails,
    };

    this.httpService.setSettingsRequest('/broadcast/processIncomingEmails', body, 'setBroadcastProcessIncomingMails').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public setAdminBroadcastProcessIncomingMailsForwarding(forwardIncomingMails: boolean) {
    this.setBroadcastProcessIncomingMailsForwarding(forwardIncomingMails);

    const body = {
      isEnabled: forwardIncomingMails,
    };

    this.httpService.setSettingsRequest('/broadcast/forwardIncomingEmails', body, 'setBroadcastProcessIncomingMailsForwading').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public setAdminBroadcastProcessIncomingMailsForwardingEmailAddresses(forwardIncomingMailsEmailAddresses: string[]) {
    this.setBroadcastIncomingMailForwardingEmailAddresses(forwardIncomingMailsEmailAddresses);

    const body = {
      email_addresses: forwardIncomingMailsEmailAddresses,
    };

    return this.httpService.setSettingsRequest(
      '/broadcast/forwardIncomingEmailsEmailAddresses',
      body,
      'setBroadcastProcessIncomingMailsForwadingEmailAddresses'
    );
  }

  public setAdminCommunityName(communityName: string) {
    this.setCommunityName(communityName);

    const body = {
      community_name: communityName,
    };
    return this.httpService.setSettingsRequest('/name', body, 'setCommunityName');
  }

  public setAdminCommunityUrl(communityUrl: string) {
    this.setCommunityUrl(communityUrl);

    const body = {
      community_url: communityUrl,
    };
    return this.httpService.setSettingsRequest('/communityUrl', body, 'setCommunityUrl');
  }

  public setAdminCommunityDescription(communityDescription: string) {
    this._serverInfo.community_description = communityDescription;
    this.updateLocalServerInfo();

    const body = {community_description: communityDescription};
    return this.httpService.setSettingsRequest('/description', body, 'setDescription');
  }

  public setAdminCommunityImprint(imprint: string) {
    this._serverInfo.community_imprint = imprint;
    this.updateLocalServerInfo();

    const body = {
      community_imprint: imprint,
    };
    return this.httpService.setSettingsRequest('/imprint', body, 'setImprint');
  }

  public setAdminCommunityPrivacyPolicy(privacyPolicy: string) {
    this._serverInfo.community_privacy_policy = privacyPolicy;
    this.updateLocalServerInfo();

    const body = {
      community_privacy_policy: privacyPolicy,
    };
    return this.httpService.setSettingsRequest('/privacyPolicy', body, 'setPrivacyPolicy');
  }

  public setAdminAppUrl(url: string) {
    this.setAppUrl(url);

    const body = {
      url,
    };
    return this.httpService.setSettingsRequest('/url', body, 'setAppUrl');
  }

  public setAdminOpenWeatherMapKey(key: string) {
    this.setOpenWeatherMapKey(key);

    const body = {
      openweathermap_key: key,
    };
    return this.httpService.setSettingsRequest('/openweathermap/key', body, 'setOpenWeatherMapKey');
  }

  public setAdminOpenWeatherMapCinemaCityId(id: string) {
    this.setOpenWeatherMapCinemaCityId(id);

    const body = {
      openweathermap_cinema_city_id: id,
    };
    return this.httpService.setSettingsRequest('/openweathermap/cinemaCityId', body, 'setOpenWeatherMapCinemaCityId');
  }

  public setAdminAlert(alert: any) {
    this.setAlert(alert);
    return this.httpService.setSettingsRequest('/alert', alert, 'setAlert');
  }

  public setAdminJitsiMeetInstanceUrl(instanceUrl: string) {
    this.setJitsiMeetInstanceUrl(instanceUrl);
    const body = {
      instance_url: instanceUrl,
    };

    return this.httpService.setSettingsRequest('/jitsiInstanceUrl', body, 'setJitsiInstanceUrl');
  }

  public getOpenWeatherMapKey(): string {
    this.httpService.getSettingRequest('/openweathermap/key', 'settingsOpenWeatherMapKey').subscribe(
      (response: any) => {
        console.log(response);
        this.setOpenWeatherMapKey(response.openweathermap_key);
      },
      (error) => console.log(error)
    );
    return this._openWeatherMapKey;
  }

  public getOpenWeatherMapCinemaCityId(): string {
    this.httpService.getSettingRequest('/openweathermap/cinemaCityId', 'settingsOpenWeatherMapCinemaCityId').subscribe(
      (response: any) => {
        console.log(response);
        this.setOpenWeatherMapCinemaCityId(response.openweathermap_cinema_city_id);
      },
      (error) => console.log(error)
    );
    return this._openWeatherMapCinemaCityId;
  }

  public getBroadcastIncomingMailForwardingEmailAddresses(): string[] {
    this.httpService
      .loggedInV1GETRequest(
        '/system/settings/broadcast/forwardIncomingEmailsEmailAddresses',
        'settingsBroadcastIncomingMailForwardingEmailAddresses'
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.setBroadcastIncomingMailForwardingEmailAddresses(response.email_addresses);
        },
        (error) => console.log(error)
      );
    return this._broadcastIncomingMailForwardingEmailAddresses;
  }

  public getAlert(): string {
    this.httpService.getSettingRequest('/alert', 'getAlert').subscribe(
      (response: any) => {
        console.log(response);
        this.setAlert(response.alert);
      },
      (error) => console.log(error)
    );
    return this._alert;
  }

  public getJistiMeetInstanceUrl(): string {
    this.httpService.getSettingRequest('/jitsiInstanceUrl', 'getJitsiInstanceUrl').subscribe(
      (response: any) => {
        console.log(response);
        this.setJitsiMeetInstanceUrl(response.instance_url);
      },
      (error) => console.log(error)
    );
    return this._jitsiMeetInstanceUrl;
  }

  private setShowCinema(showCinema: boolean) {
    this._serverInfo.cinema_enabled = showCinema;
    this.updateLocalServerInfo();
  }

  private setShowEvents(showEvents: boolean) {
    this._serverInfo.events_enabled = showEvents;
    this.updateLocalServerInfo();
  }

  private setShowBroadcasts(showBroadcasts: boolean) {
    this._serverInfo.broadcasts_enabled = showBroadcasts;
    this.updateLocalServerInfo();
  }

  private setBroadcastProcessIncomingMails(processIncomingMails: boolean) {
    this._serverInfo.broadcasts_process_incoming_mails_enabled = processIncomingMails;
    this.updateLocalServerInfo();
  }

  private setBroadcastProcessIncomingMailsForwarding(forwardIncomingMails: boolean) {
    this._serverInfo.broadcasts_process_incoming_mails_forwarding_enabled = forwardIncomingMails;
    this.updateLocalServerInfo();
  }

  private setCommunityName(communityName: string) {
    this._serverInfo.community_name = communityName;
    this.updateLocalServerInfo();
  }

  private setCommunityUrl(communityUrl: string) {
    this._serverInfo.community_url = communityUrl;
    this.updateLocalServerInfo();
  }

  private setAppUrl(url: string) {
    this._serverInfo.application_url = url;
    this.updateLocalServerInfo();
  }

  private setOpenWeatherMapKey(key: string) {
    this._openWeatherMapKey = key;
    this.openWeatherMapKeyChange.next(this._openWeatherMapKey);
  }

  private setOpenWeatherMapCinemaCityId(id: string) {
    this._openWeatherMapCinemaCityId = id;
    this.openWeatherMapCinemaCityIdChange.next(this._openWeatherMapCinemaCityId);
  }

  private setBroadcastIncomingMailForwardingEmailAddresses(incomingMailForwardingMailAddresses: string[]) {
    this._broadcastIncomingMailForwardingEmailAddresses = incomingMailForwardingMailAddresses;
    this.broadcastIncomingMailForwardingEmailAddressesChange.next(this._broadcastIncomingMailForwardingEmailAddresses);
  }

  private setAlert(alert: any) {
    this._alert = alert;
    this.alertChange.next(this._alert);
  }

  private setJitsiMeetInstanceUrl(instanceUrl: string) {
    this._jitsiMeetInstanceUrl = instanceUrl;
    this.jitsiMeetInstanceUrlChange.next(this._jitsiMeetInstanceUrl);
  }

  private updateLocalServerInfo() {
    this.serverInfoChange.next(this._serverInfo);
  }
}
