import {NgModule} from '@angular/core';

import {MaterialModule} from '../material-module';
import {TranslationModule} from '../translation/translation.module';

import {DoNotForgetToSaveComponent} from '../home/do-not-forget-to-save/do-not-forget-to-save.component';

@NgModule({
  declarations: [
    DoNotForgetToSaveComponent,
  ],
  imports: [
    MaterialModule,
    TranslationModule
  ],
  exports: [
    DoNotForgetToSaveComponent,
  ]
})
export class CommonComponentsModule {}
