import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from './translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: any): any {
    if (this.translate.data[key]) {
      return this.translate.data[key];
    } else if (this.translate.autoGeneratedData[key]) {
      return this.translate.autoGeneratedData[key];
    } else {
      return key;
    }
  }
}
