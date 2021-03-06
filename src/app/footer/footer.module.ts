import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {FooterRoutingModule} from './footer-routing.module';

import {ImprintComponent} from './info/imprint/imprint.component';
import {InfoComponent} from './info/info.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';
import {NoSanitizeModule} from '../utils/shared-components/no-sanitize/noSanitize.module';

@NgModule({
  declarations: [FooterComponent, AboutModalComponent, InfoComponent, ImprintComponent, PrivacyPolicyComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, FooterRoutingModule, NoSanitizeModule],
  exports: [FooterComponent],
})
export class FooterModule {}
