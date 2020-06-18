export class Broadcast {
  public id: number;
  public subject: string;
  public sent: Date;
  public body: string;
  public bodyPreview: string;
  private previewLength = 30;
  public bodyHTML: string;
  public writerName: string;

  public forEveryone: boolean;
  public groups: any[];
  public subgroups: any[];

  constructor(id: number, subject: string, sent: Date, body: string, writerName: string) {
    this.id = id;
    this.subject = subject;
    this.sent = sent;
    this.body = body;
    if (this.body.length > this.previewLength) {
      this.bodyPreview = this.body.slice(0, this.previewLength) + '...';
    } else {
      this.bodyPreview = this.body;
    }
    this.writerName = writerName;
  }
}
