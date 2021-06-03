export class UserChange {
  public id: number;
  public userId: number;
  public userName: string;
  public editorId: number;
  public editorName: string;
  public editedAt: Date;
  public property: string;
  public oldValue: string;
  public newValue: string;

  constructor(
    id: number,
    userId: number,
    userName: string,
    editorId: number,
    editorName: string,
    editedAt: Date,
    property: string,
    oldValue: string,
    newValue: string
  ) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.editorId = editorId;
    this.editorName = editorName;
    this.editedAt = editedAt;
    this.property = property;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}
