import {NgModule} from '@angular/core';
import {TranslatePipe} from './translate.pipe';
import {BooleanPipe} from './boolean.pipe';

@NgModule({
  imports: [],
  declarations: [TranslatePipe, BooleanPipe],
  exports: [TranslatePipe, BooleanPipe]
})
export class TranslationModule {
}
