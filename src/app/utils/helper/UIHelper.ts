export class UIHelper {
  private static currentDate: Date;
  private static WORDS_PER_MIN = 275; // wpm
  private static IMAGE_READ_TIME = 12; // in seconds
  private static CHINESE_KOREAN_READ_TIME = 500; // cpm

  public static getCurrentDate(): Date {
    if (this.currentDate == null) {
      this.currentDate = new Date();
    }
    return this.currentDate;
  }

  public static getTimeLeft(date: Date) {
    const current = this.getCurrentDate();

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

  public static cutString(string: string, length: number = 10, suffix: string = '...') {
    if (string.length < length) {
      return string;
    }
    return string.slice(0, length) + suffix;
  }

  public static cutStrings(strings: string[], length: number, suffix: string = null, seperator: string = ',') {
    let toReturn = '';
    for (const string of strings) {
      toReturn += string + seperator + ' ';
    }

    if (toReturn.length > length) {
      return toReturn.slice(0, length) + suffix;
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

  // --------------------------------------------- Read time -----------------------------------------------

  private static stripWhitespace(string: string) {
    return string.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  private static imageReadTime(count: number, customImageTime: number = UIHelper.IMAGE_READ_TIME) {
    let seconds;

    if (count > 10) {
      seconds = (count / 2) * (customImageTime + 3) + (count - 10) * 3; // n/2(a+b) + 3 sec/image
    } else {
      seconds = (count / 2) * (2 * customImageTime + (1 - count)); // n/2[2a+(n-1)d]
    }
    return {
      time: seconds / 60,
      count,
    };
  }

  private static wordsCount(string: string) {
    const pattern = '\\w+';
    const reg = new RegExp(pattern, 'g');
    return (string.match(reg) || []).length;
  }

  // Chinese / Japanese / Korean
  private static otherLanguageReadTime(string: string) {
    const pattern = '[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]';
    const reg = new RegExp(pattern, 'g');
    const count = (string.match(reg) || []).length;
    const time = count / UIHelper.CHINESE_KOREAN_READ_TIME;
    const formattedString = string.replace(reg, '');
    return {
      count,
      time,
      formattedString,
    };
  }

  private static wordsReadTime(string: string, wordsPerMin = UIHelper.WORDS_PER_MIN) {
    const {count: characterCount, time: otherLanguageTime, formattedString} = UIHelper.otherLanguageReadTime(string);
    const wordCount = UIHelper.wordsCount(formattedString);
    const wordTime = wordCount / wordsPerMin;
    return {
      characterCount,
      otherLanguageTime,
      wordTime,
      wordCount,
    };
  }

  private static humanizeTime(time): string {
    if (time < 0.5) {
      return '> 1m';
    }
    if (time >= 0.5 && time < 1.5) {
      return '1m';
    }
    return `${Math.ceil(time)}m`;
  }

  public static getReadTime(string: string, imageCounter: number = 0): string {
    const {time: imageTime, count: imageCount} = this.imageReadTime(imageCounter);
    const strippedString = UIHelper.stripWhitespace(string);
    const {characterCount, otherLanguageTime, wordTime, wordCount} = this.wordsReadTime(strippedString);
    return this.humanizeTime(imageTime + wordTime);
  }
}
