export class PhoneNumber {
  private readonly id: number;
  private readonly userID: number;
  private readonly label: string;
  private readonly phoneNumber: string;

  constructor(id: number, userID: number, label: string, phoneNumber: string) {
    this.id = id;
    this.userID = userID;
    this.label = label;
    this.phoneNumber = phoneNumber;
  }

  public getID(): number {
    return this.id;
  }

  public getUserID(): number {
    return this.userID;
  }

  public getLabel() {
    return this.label;
  }

  public getPhoneNumber() {
    return this.phoneNumber;
  }
}
