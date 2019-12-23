export class HomeBirthdayModel {
  public readonly name: string;
  public readonly date: Date;
  public readonly age: number;

  constructor(name: string, date: Date) {
    this.name = name;
    this.date = date;

    this.age = new Date().getFullYear() - new Date(this.date).getFullYear();
  }
}
