import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';
import {CalendarDateFormatter, DateFormatterParams} from 'angular-calendar';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  public dayViewHour({date, locale}: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'HH:mm', locale);
  }

  public weekViewHour({date, locale}: DateFormatterParams): string {
    return this.dayViewHour({date, locale});
  }
}
