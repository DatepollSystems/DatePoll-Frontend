import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';
import {FooterRoutingModule} from './footer-routing.module';

import {FooterComponent} from './footer.component';
import {FeedbackModalComponent} from './modals/feedback-modal/feedback-modal.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';
import {InfoComponent} from '../info/info.component';
import {ImprintComponent} from '../info/imprint/imprint.component';
import {PrivacyPolicyComponent} from '../info/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    FooterComponent,
    FeedbackModalComponent,
    AboutModalComponent,
    InfoComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
  ],
  entryComponents: [
    FeedbackModalComponent,
    AboutModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    FooterRoutingModule
  ],
  exports: [
    FooterComponent,
    FeedbackModalComponent,
    AboutModalComponent,
    InfoComponent,
    ImprintComponent
  ]
})
export class FooterModule {}
