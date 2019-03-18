export class PhoneNumber {
  public readonly id: number;
  public readonly label: string;
  public readonly phoneNumber: string;

  constructor(id: number, label: string, phoneNumber: string) {
    this.id = id;
    this.label = label;
    this.phoneNumber = phoneNumber;
  }
}
