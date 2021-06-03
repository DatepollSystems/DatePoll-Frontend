export class UserPerformanceBadge {
  public readonly id: number;
  public readonly performanceBadgeId: number;
  public readonly performanceBadgeName: string;
  public readonly instrumentId: number;
  public readonly instrumentName: string;
  public readonly date: Date;
  public readonly grade: string;
  public readonly note: string;

  constructor(
    id: number,
    performanceBadgeId: number,
    instrumentId: number,
    performanceBadgeName: string,
    instrumentName: string,
    date: Date,
    grade: string,
    note: string
  ) {
    this.id = id;
    this.performanceBadgeId = performanceBadgeId;
    this.instrumentId = instrumentId;
    this.performanceBadgeName = performanceBadgeName;
    this.instrumentName = instrumentName;
    this.date = date;
    this.grade = grade;
    this.note = note;
  }
}
