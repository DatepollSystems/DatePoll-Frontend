export class Badge {
  public readonly id: number;
  public readonly description: string;
  public readonly afterYears: number;

  constructor(id: number, description: string, afterYears: number) {
    this.id = id;
    this.description = description;
    this.afterYears = afterYears;
  }
}
