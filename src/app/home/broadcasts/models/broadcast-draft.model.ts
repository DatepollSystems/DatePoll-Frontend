export class BroadcastDraft {
  public id: number;
  public subject: string;
  public body: string;
  public bodyHTML: string;
  public writerName: string;

  constructor(id: number, subject: string, body: string, writerName: string) {
    this.id = id;
    this.subject = subject;
    this.body = body;
    this.writerName = writerName;
  }
}
