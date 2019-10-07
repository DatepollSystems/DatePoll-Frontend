export enum LogType {
  INFO, WARNING, ERROR
}

export class Log {
  public readonly id: number;
  public readonly type: LogType;
  public readonly typeString: string;
  public readonly message: string;
  public readonly createdAt: Date;

  constructor(id: number, type: LogType, typeString: string, message: string, createdAt: Date) {
    this.id = id;
    this.type = type;
    this.typeString = typeString;
    this.message = message;
    this.createdAt = createdAt;
  }
}
