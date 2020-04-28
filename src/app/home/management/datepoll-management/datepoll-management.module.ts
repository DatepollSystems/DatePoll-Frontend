import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {QuestionDialogComponentModule} from '../../../utils/shared-components/question-dialog/question-dialog-component.module';
import {TranslationModule} from '../../../translation/translation.module';
import {DatepollManagementRoutingModule} from './datepoll-management-routing.module';

import {DatepollManagementComponent} from './datepoll-management.component';
import {LogsComponent} from './logs/logs.component';

@NgModule({
  declarations: [DatepollManagementComponent, LogsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
    QuestionDialogComponentModule,
    DatepollManagementRoutingModule
  ]
})
export class DatepollManagementModule {}
