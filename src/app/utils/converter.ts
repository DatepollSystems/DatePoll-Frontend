import {Browser} from './browser';

export class Converter {
  public static getDateFormattedWithHoursMinutesAndSeconds(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    let hour = '' + d.getHours();
    let minutes = '' + d.getMinutes();
    let seconds = '' + d.getSeconds();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (hour.length < 2) {
      hour = '0' + hour;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }

    let dateformatted = [year, month, day].join('-');
    dateformatted += ' ' + [hour, minutes, seconds].join(':');

    return dateformatted;
  }

  public static getDateFormatted(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  public static getIOSDate(value: string): Date {
    let temp = value.toString().replace(' ', 'T');
    let date;
    if (Browser.getInfos().name.includes('Safari')) {
      if (temp.includes('000000Z')) {
        temp = temp.replace('.000000Z', '');

        date = new Date(temp);
        date.setHours(date.getHours() + 2);
        return date;
      }
      if (temp.includes('T')) {
        temp += '.000+02:00';
      }
    }
    date = new Date(temp);
    return date;
  }
}
