import {UIHelper} from '../../../utils/helper/UIHelper';

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

  public attachments: any[];

  public userInfos: UserBroadcastInfo[];

  public readTime: string;

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

    // Calculate read time at about 200 words per minute
    this.readTime = UIHelper.getReadTime(this.body);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class UserBroadcastInfo {
  public userName: string;
  public sent: boolean;

  public queuedAt: Date;
  public sentAt: Date;

  constructor(userName: string, sent: boolean, queuedAt: Date, sentAt: Date) {
    this.userName = userName;
    this.sent = sent;
    this.queuedAt = queuedAt;
    this.sentAt = sentAt;
  }
}
