export class UserBadge {
  public readonly id: number;
  public readonly description: string;
  public readonly getDate: Date;
  public readonly reason: string;

  constructor(id: number, description: string, getDate: Date, reason: string) {
    this.id = id;
    this.description = description;
    this.getDate = getDate;
    this.reason = reason;
  }
}
