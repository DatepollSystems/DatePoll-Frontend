import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';
import {FooterRoutingModule} from './footer-routing.module';

import {ImprintComponent} from '../info/imprint/imprint.component';
import {InfoComponent} from '../info/info.component';
import {PrivacyPolicyComponent} from '../info/privacy-policy/privacy-policy.component';
import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';
import {FeedbackModalComponent} from './modals/feedback-modal/feedback-modal.component';

@NgModule({
  declarations: [FooterComponent, FeedbackModalComponent, AboutModalComponent, InfoComponent, ImprintComponent, PrivacyPolicyComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TranslationModule, FooterRoutingModule],
  exports: [FooterComponent, FeedbackModalComponent, AboutModalComponent, InfoComponent, ImprintComponent]
})
export class FooterModule {}
