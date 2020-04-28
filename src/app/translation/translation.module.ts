import {NgModule} from '@angular/core';

import {BooleanPipe} from './boolean.pipe';
import {TranslatePipe} from './translate.pipe';

@NgModule({
  imports: [],
  declarations: [TranslatePipe, BooleanPipe],
  exports: [TranslatePipe, BooleanPipe]
})
export class TranslationModule {}
