export class UIHelper {
  private static currentDate: Date;

  public static getCurrentDate(): Date {
    if (this.currentDate == null) {
      this.currentDate = new Date();
    }
    console.log(this.currentDate);
    return this.currentDate;
  }

  public static getTimeLeft(date: Date) {
    const current = new Date();

    const days = Math.round((date.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.round(Math.abs(date.getTime() - current.getTime()) / (60 * 60 * 1000));
      return hours + 'h';
    } else if (days > 31) {
      const months = date.getFullYear() * 12 + date.getMonth() - (current.getFullYear() * 12 + current.getMonth());
      return months + 'mo';
    } else {
      return days + 'd';
    }
  }

  public static isStringUrl(url: string) {
    // http://w.at
    if (url.length < 10) {
      return false;
    }
    if (!url.includes('http') && !url.includes('https')) {
      return false;
    }
    return !(!url.includes('.') || !url.includes(':') || !url.includes('//'));
  }

  public static cutString(strings: string[], length: number, prefix: string = null, seperator: string = ',') {
    let toReturn = '';
    for (const string of strings) {
      toReturn += string + seperator + ' ';
    }

    if (toReturn.length > length) {
      return toReturn.slice(0, length) + prefix;
    }
    return toReturn;
  }

  public static isNumeric(str: any) {
    // tslint:disable-next-line:triple-equals
    if (typeof str != 'string') {
      return false;
    } // we only process strings!
    // @ts-ignore
    return (
      !isNaN(parseInt(str, 10)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }
}
