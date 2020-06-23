import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {GroupAndSubgroupModel, GroupType} from '../../models/groupAndSubgroup.model';

@Component({
  selector: 'app-group-and-subgroup-type-input-select',
  templateUrl: './group-and-subgroup-type-input-select.component.html',
  styleUrls: ['./group-and-subgroup-type-input-select.component.css']
})
export class GroupAndSubgroupTypeInputSelectComponent implements OnInit, OnChanges {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  groupCtrl = new FormControl();
  filteredGroups: Observable<GroupAndSubgroupModel[]>;

  @Input()
  disabled = false;

  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input()
  allGroupsAndSubgroups: GroupAndSubgroupModel[];
  @Input()
  selectedGroupsAndSubgroups: GroupAndSubgroupModel[] = [];

  @Input()
  parentGroupLocked = false;

  @Output()
  groupsAndSubgroupsChange = new EventEmitter<GroupAndSubgroupModel[]>();
  @Output()
  allGroupsAndSubgroupsChange = new EventEmitter<GroupAndSubgroupModel[]>();

  constructor() {}

  ngOnInit(): void {
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.update();
  }

  update() {
    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(null),
      map((group: any | null) => (group ? this._filter(group) : this.allGroupsAndSubgroups.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const check = this.getGroupByName(value);
    if (check == null) {
      return;
    }
    this.addToSelectedGroups(check);

    if (input) {
      input.value = '';
    }
    this.groupCtrl.setValue(null);
  }

  remove(group: GroupAndSubgroupModel): void {
    this.removeFromSelectedGroups(group);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addToSelectedGroups(event.option.value);
    this.groupInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
  }

  private _filter(value: any): GroupAndSubgroupModel[] {
    let filterValue;
    if (value == null) {
      return this.allGroupsAndSubgroups;
    } else if (value instanceof GroupAndSubgroupModel) {
      filterValue = value.name.toLowerCase();
    } else {
      filterValue = value.toLowerCase();
    }
    return this.allGroupsAndSubgroups.filter(group => group.name.toLowerCase().indexOf(filterValue) === 0);
  }

  addToSelectedGroups(group: GroupAndSubgroupModel) {
    if (this.parentGroupLocked && group.type === GroupType.SUBGROUP) {
      for (const parentGroup of this.allGroupsAndSubgroups) {
        if (parentGroup.type === GroupType.PARENTGROUP && parentGroup.id === group.groupId) {
          this.selectedGroupsAndSubgroups.push(parentGroup);

          const indexParentGroup = this.allGroupsAndSubgroups.indexOf(parentGroup);

          if (indexParentGroup >= 0) {
            this.allGroupsAndSubgroups.splice(indexParentGroup, 1);
          }
          break;
        }
      }
    }

    this.selectedGroupsAndSubgroups.push(group);

    const index = this.allGroupsAndSubgroups.indexOf(group);

    if (index >= 0) {
      this.allGroupsAndSubgroups.splice(index, 1);
    }

    this.update();
    this.allGroupsAndSubgroupsChange.emit(this.allGroupsAndSubgroups.slice());
    this.groupsAndSubgroupsChange.emit(this.selectedGroupsAndSubgroups.slice());
  }

  removeFromSelectedGroups(group: GroupAndSubgroupModel) {
    const toDelete = [];
    if (this.parentGroupLocked && group.type === GroupType.PARENTGROUP) {
      for (const subgroup of this.selectedGroupsAndSubgroups) {
        console.log(subgroup.name);
        if (subgroup.type === GroupType.SUBGROUP && group.id === subgroup.groupId) {
          this.allGroupsAndSubgroups.push(subgroup);
          toDelete.push(subgroup);
        }
      }
    }
    toDelete.push(group);

    for (const toDeleteO of toDelete) {
      const index = this.selectedGroupsAndSubgroups.indexOf(toDeleteO);

      if (index >= 0) {
        this.selectedGroupsAndSubgroups.splice(index, 1);
        this.allGroupsAndSubgroups.push(toDeleteO);
      }
    }

    this.update();
    this.allGroupsAndSubgroupsChange.emit(this.allGroupsAndSubgroups.slice());
    this.groupsAndSubgroupsChange.emit(this.selectedGroupsAndSubgroups.slice());
  }

  getGroupByName(value: string) {
    for (const groupAndSubgroup of this.allGroupsAndSubgroups) {
      if (value === groupAndSubgroup.name) {
        return groupAndSubgroup;
      }
    }
    return null;
  }
}
