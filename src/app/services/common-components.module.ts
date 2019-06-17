import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter} from '@angular/material';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';
import {CustomDateAdapter} from './custom-date-adapter';

import {DoNotForgetToSaveComponent} from './shared-components/do-not-forget-to-save/do-not-forget-to-save.component';
import {MovieEditModalComponent} from '../home/cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {EmailAddressesListComponent} from '../home/management/users-management/email-addresses-list/email-addresses-list.component';
import {MovieInfoModalComponent} from '../home/cinema/movie-administration/movie-info-modal/movie-info-modal.component';
import { GroupAndSubgroupSelectComponent } from './shared-components/group-and-subgroup-select/group-and-subgroup-select.component';

@NgModule({
  declarations: [
    DoNotForgetToSaveComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    EmailAddressesListComponent,
    GroupAndSubgroupSelectComponent
  ],
  entryComponents: [
    MovieEditModalComponent,
    MovieInfoModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
  ],
  exports: [
    DoNotForgetToSaveComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    EmailAddressesListComponent,
    GroupAndSubgroupSelectComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class CommonComponentsModule {
}
