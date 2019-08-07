import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from './translate.service';

@Pipe({name: 'boolean'})
export class BooleanPipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(value: boolean): string {
    return value ? this.translate.getTranslationFor('YES') : this.translate.getTranslationFor('NO');
  }
}
