import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NoSanitizePipe} from './no-sanitize.pipe';

@NgModule({
  declarations: [NoSanitizePipe],
  imports: [CommonModule],
  exports: [NoSanitizePipe],
})
export class NoSanitizeModule {}
