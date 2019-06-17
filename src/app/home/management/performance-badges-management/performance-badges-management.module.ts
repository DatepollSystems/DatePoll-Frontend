import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {PerformanceBadgesManagementRoutingModule} from './performance-badges-management-routing.module';

import {PerformanceBadgesManagmentComponent} from './performance-badges-managment.component';
import {PerformanceBadgeUpdateModalComponent} from './performance-badge-update-modal/performance-badge-update-modal.component';
import {InstrumentUpdateModalComponent} from './instrument-update-modal/instrument-update-modal.component';

@NgModule({
  declarations: [
    PerformanceBadgesManagmentComponent,
    PerformanceBadgeUpdateModalComponent,
    InstrumentUpdateModalComponent
  ],
  entryComponents: [
    PerformanceBadgeUpdateModalComponent,
    InstrumentUpdateModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MaterialModule,
    TranslationModule,
    PerformanceBadgesManagementRoutingModule
  ]
})
export class PerformanceBadgesManagementModule {
}
