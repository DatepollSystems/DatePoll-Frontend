export class Job {
  public readonly id: number;
  public readonly connection: string;
  public readonly queue: string;
  public readonly payload: string;
  public readonly exception: string;
  public readonly failedAt: Date;

  constructor(id: number, connection: string, queue: string, payload: string, exception: string, failedAt: Date) {
    this.id = id;
    this.connection = connection;
    this.queue = queue;
    this.payload = payload;
    this.exception = exception;
    this.failedAt = failedAt;
  }
}
