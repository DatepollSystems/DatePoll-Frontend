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
}
