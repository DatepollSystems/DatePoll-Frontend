import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FooterModule} from '../footer/footer.module';
import {MaterialModule} from '../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {BroadcastDownloadRoutingModule} from './broadcast-download-routing.module';

import {BroadcastDownloadComponent} from './broadcast-download.component';

@NgModule({
  declarations: [BroadcastDownloadComponent],
  imports: [CommonModule, MaterialModule, DfxTranslateModule, FooterModule, BroadcastDownloadRoutingModule],
  providers: [],
})
export class BroadcastDownloadModule {}
