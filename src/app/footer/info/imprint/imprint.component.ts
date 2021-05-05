import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../../utils/settings.service';

import {ServerInfoModel} from '../../../utils/server-info.model';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.css'],
})
export class ImprintComponent implements OnDestroy {
  serverInfo: ServerInfoModel;
  serverInfoSubscription: Subscription;

  constructor(private settingsService: SettingsService) {
    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });
  }

  ngOnDestroy() {
    this.serverInfoSubscription.unsubscribe();
  }
}
