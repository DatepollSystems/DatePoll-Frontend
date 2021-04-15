export class UIHelper {
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
    if (!url.includes('.') || !url.includes(':') || !url.includes('//')) {
      return false;
    }
    return true;
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
}
