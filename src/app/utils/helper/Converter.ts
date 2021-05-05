import {BrowserHelper} from './BrowserHelper';

export class Converter {
  public static stringToBoolean(string: string): boolean {
    return string.trim().toLowerCase() === 'true';
  }

  public static booleanToString(boolean: boolean): string {
    return boolean ? 'true' : 'false';
  }

  public static numberToString(number: number): string {
    return number.toString();
  }

  public static stringToNumber(string: string): number {
    return parseInt(string, 10);
  }

  public static getDateFormattedWithHoursMinutesAndSeconds(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
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
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
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
    if (BrowserHelper.getInfos().name.includes('Safari')) {
      const dDate = temp.split('T')[0].replace(/-/g, '/');
      date = new Date(dDate);
      if (temp.includes('T')) {
        let hours = Number(temp.substring(11, 13));
        const minutes = temp.substring(14, 16);
        const seconds = temp.substring(17, 19);

        // Check for server time in wrong timezone and add austrian utc offset
        if (temp.includes('000000Z')) {
          if (this.isDaylightSavingTime(date)) {
            hours = hours + 2;
          } else {
            hours = hours + 1;
          }
        }

        date.setHours(hours);
        date.setMinutes(Number(minutes));
        date.setSeconds(Number(seconds));
      }
    }
    return date;
  }

  private static isDaylightSavingTime(d) {
    const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
  }
}
