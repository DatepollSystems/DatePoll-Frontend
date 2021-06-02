export enum GroupType {
  PARENTGROUP,
  SUBGROUP,
}

export class GroupAndSubgroupModel {
  public id: number;
  public name: string;
  public type: GroupType;
  public groupId: number;
  public groupName: string;

  constructor(id: number, name: string, type: GroupType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}
