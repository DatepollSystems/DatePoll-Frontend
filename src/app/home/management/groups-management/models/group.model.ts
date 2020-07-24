import {Subgroup} from './subgroup.model';

export class Group {
  id: number;
  name: string;
  description: string;
  orderN: number;
  private _subgroups: Subgroup[];

  constructor(id: number, name: string, description: string, orderN: number, _subgroups: Subgroup[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.orderN = orderN;
    this._subgroups = _subgroups;
  }

  public getSubgroups(): Subgroup[] {
    return this._subgroups.slice();
  }
}
