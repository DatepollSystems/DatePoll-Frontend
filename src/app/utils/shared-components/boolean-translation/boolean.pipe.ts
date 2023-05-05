import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from 'dfx-translate';

@Pipe({name: 'boolean'})
export class BooleanPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: boolean): string {
    return value ? this.translate.translate('YES') : this.translate.translate('NO');
  }
}
