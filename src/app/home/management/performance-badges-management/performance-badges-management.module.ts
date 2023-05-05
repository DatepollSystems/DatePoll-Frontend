import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {PerformanceBadgesManagementRoutingModule} from './performance-badges-management-routing.module';

import {InstrumentUpdateModalComponent} from './instrument-update-modal/instrument-update-modal.component';
import {PerformanceBadgeUpdateModalComponent} from './performance-badge-update-modal/performance-badge-update-modal.component';
import {PerformanceBadgesManagmentComponent} from './performance-badges-managment.component';

@NgModule({
  declarations: [PerformanceBadgesManagmentComponent, PerformanceBadgeUpdateModalComponent, InstrumentUpdateModalComponent],
  imports: [CommonModule, FormsModule, MaterialModule, DfxTranslateModule, PerformanceBadgesManagementRoutingModule],
})
export class PerformanceBadgesManagementModule {}
