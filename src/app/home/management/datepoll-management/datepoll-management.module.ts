import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material-module';
import {TranslationModule} from '../../../translation/translation.module';
import {DatepollManagementRoutingModule} from './datepoll-management-routing.module';

import {DatepollManagementComponent} from './datepoll-management.component';
import {LogsComponent} from './logs/logs.component';

@NgModule({
  declarations: [DatepollManagementComponent, LogsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TranslationModule, DatepollManagementRoutingModule]
})
export class DatepollManagementModule {}
