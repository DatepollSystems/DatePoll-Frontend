export class Session {
  public readonly id: number;
  public readonly information: string;
  public readonly lastUsed: Date;

  constructor(id: number, information: string, lastUsed: Date) {
    this.id = id;
    this.information = information;
    this.lastUsed = lastUsed;
  }
}
