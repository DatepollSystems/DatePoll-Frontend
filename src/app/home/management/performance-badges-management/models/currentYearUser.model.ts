export class CurrentYearUser {
  public readonly id: number;
  public readonly firstname: string;
  public readonly surname: string;
  public readonly joinDate: Date;

  public currentYearBadges: CurrentYearBadge[] = [];

  constructor(id: number, firstname: string, surname: string, joinDate: Date) {
    this.id = id;
    this.firstname = firstname;
    this.surname = surname;
    this.joinDate = joinDate;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class CurrentYearBadge {
  public readonly id: number;
  public readonly description: string;
  public readonly afterYears: number;

  constructor(id: number, description: string, afterYears: number) {
    this.id = id;
    this.description = description;
    this.afterYears = afterYears;
  }
}
