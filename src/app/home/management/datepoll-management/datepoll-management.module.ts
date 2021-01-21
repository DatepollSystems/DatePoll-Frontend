import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {QuestionDialogComponentModule} from '../../../utils/shared-components/question-dialog/question-dialog-component.module';
import {DatepollManagementRoutingModule} from './datepoll-management-routing.module';

import {DatepollManagementComponent} from './datepoll-management.component';
import {JobViewModalComponent} from './jobs/job-view-modal/job-view-modal.component';
import {JobsComponent} from './jobs/jobs.component';
import {LogsComponent} from './logs/logs.component';
import {ListChipInputModule} from '../../../utils/shared-components/list-chip-input/list-chip-input.module';

@NgModule({
  declarations: [DatepollManagementComponent, LogsComponent, JobsComponent, JobViewModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    TranslationModule,
    QuestionDialogComponentModule,
    DatepollManagementRoutingModule,
    ListChipInputModule,
  ],
})
export class DatepollManagementModule {}
