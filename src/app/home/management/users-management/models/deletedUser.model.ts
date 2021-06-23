export class DeletedUser {
  public id: number;
  public firstname: string;
  public surname: string;
  public join_date: Date;
  public internalComment: string;
  public deletedAt: Date;

  constructor(id: number, firstname: string, surname: string, join_date: Date, internalComent: string, deletedAt: Date) {
    this.id = id;
    this.firstname = firstname;
    this.surname = surname;
    this.join_date = join_date;
    this.internalComment = internalComent;
    this.deletedAt = deletedAt;
  }
}
