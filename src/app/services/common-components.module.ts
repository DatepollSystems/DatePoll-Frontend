import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormsModule} from 'ng2-validation';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';

import {DoNotForgetToSaveComponent} from '../home/do-not-forget-to-save/do-not-forget-to-save.component';
import {MovieEditModalComponent} from '../home/cinema/movie-administration/movie-edit-modal/movie-edit-modal.component';
import {EmailAddressesListComponent} from '../home/management/users-management/email-addresses-list/email-addresses-list.component';
import {MovieInfoModalComponent} from '../home/cinema/movie-administration/movie-info-modal/movie-info-modal.component';

@NgModule({
  declarations: [
    DoNotForgetToSaveComponent,
    MovieEditModalComponent,
    MovieInfoModalComponent,
    EmailAddressesListComponent
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
    EmailAddressesListComponent
  ]
})
export class CommonComponentsModule {
}
