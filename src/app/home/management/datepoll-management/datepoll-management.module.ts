import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {DfxTranslateModule} from 'dfx-translate';
import {QuestionDialogComponentModule} from '../../../utils/shared-components/question-dialog/question-dialog-component.module';
import {DatepollManagementRoutingModule} from './datepoll-management-routing.module';

import {DatepollManagementComponent} from './datepoll-management.component';
import {JobViewModalComponent} from './jobs/job-view-modal/job-view-modal.component';
import {JobsComponent} from './jobs/jobs.component';
import {ListChipInputModule} from '../../../utils/shared-components/list-chip-input/list-chip-input.module';

@NgModule({
  declarations: [DatepollManagementComponent, JobsComponent, JobViewModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    DfxTranslateModule,
    QuestionDialogComponentModule,
    DatepollManagementRoutingModule,
    ListChipInputModule,
  ],
})
export class DatepollManagementModule {}
