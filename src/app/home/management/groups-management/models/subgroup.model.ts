export class Subgroup {
  id: number;
  name: string;
  description: string;
  orderN: number;

  constructor(id: number, name: string, description: string, orderN: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.orderN = orderN;
  }
}
