import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {PerformanceBadgesManagementRoutingModule} from './performance-badges-management-routing.module';

import {PerformanceBadgesService} from './performance-badges.service';

import {InstrumentDeleteModalComponent} from './instrument-delete-modal/instrument-delete-modal.component';
import {InstrumentUpdateModalComponent} from './instrument-update-modal/instrument-update-modal.component';
import {PerformanceBadgeDeleteModalComponent} from './performance-badge-delete-modal/performance-badge-delete-modal.component';
import {PerformanceBadgeUpdateModalComponent} from './performance-badge-update-modal/performance-badge-update-modal.component';
import {PerformanceBadgesManagmentComponent} from './performance-badges-managment.component';

@NgModule({
  declarations: [
    PerformanceBadgesManagmentComponent,
    PerformanceBadgeUpdateModalComponent,
    InstrumentUpdateModalComponent,
    PerformanceBadgeDeleteModalComponent,
    InstrumentDeleteModalComponent
  ],
  providers: [PerformanceBadgesService],
  imports: [CommonModule, FormsModule, MaterialModule, TranslationModule, PerformanceBadgesManagementRoutingModule]
})
export class PerformanceBadgesManagementModule {}
