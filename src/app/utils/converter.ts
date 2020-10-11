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
    const temp = value.toString().replace(' ', 'T');
    let date = new Date(temp);
    if (Browser.getInfos().name.includes('Safari')) {
      if (temp.includes('T')) {
        const dDate = temp.split('T')[0].replace(/-/g, '/');
        const hours = temp.substring(11, 13);
        const minutes = temp.substring(14, 16);
        const seconds = temp.substring(17, 19);

        // console.log('hours: ' + hours + ' minutes: ' + minutes + ' seconds: ' + seconds);

        date = new Date(dDate);
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));
        date.setSeconds(Number(seconds));
      } else {
        const dDate = temp.split('T')[0].replace(/-/g, '/');
        date = new Date(dDate);
      }
    }
    return date;
  }
}
