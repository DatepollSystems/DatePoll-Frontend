import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-group-and-subgroup-select',
  templateUrl: './group-and-subgroup-select.component.html',
  styleUrls: ['./group-and-subgroup-select.component.css']
})
export class GroupAndSubgroupSelectComponent {

  @Input()
  joined: any[] = [];
  @Input()
  free: any[] = [];

  @Input()
  parentGroupLock = true;

  @Output() joinedChanged = new EventEmitter();
  @Output() freeChanged = new EventEmitter();

  constructor() { }

  dropToJoined(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const group = event.previousContainer.data[event.previousIndex];

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      console.log('Element to move: ');
      console.log(group);

      // @ts-ignore
      const type = group.type;

      if (this.parentGroupLock) {
        if (type.includes('subgroup')) {
          console.log('Element is a subgroup');

          // @ts-ignore
          const groupID = group.group_id;
          for (let i = 0; i < this.free.length; i++) {
            const freeType = this.free[i].type;
            if (freeType.includes('parentgroup')) {
              if (this.free[i].id === groupID) {
                console.log('Detected the parent group which is not in joined!');
                console.log('Parent group element: ');
                const saveGroup = this.free[i];
                console.log(saveGroup);
                this.joined.push(saveGroup);
                this.free.splice(i, 1);
              }
            }
          }
        }
      }

      this.joinedChanged.emit(this.joined.slice());
      this.freeChanged.emit(this.free.slice());
    }
  }

  dropToFree(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const group = event.previousContainer.data[event.previousIndex];

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      console.log('Element to move: ');
      console.log(group);

      // @ts-ignore
      const type = group.type;

      if (this.parentGroupLock) {
        if (type.includes('parentgroup')) {
          console.log('Element is a parentgroup');

          const toSplice = [];

          // @ts-ignore
          const groupID = group.id;
          for (let i = 0; i < this.joined.length; i++) {
            console.log('Is in joined: ' + this.joined[i].name);

            const joinedType = this.joined[i].type;

            if (joinedType.includes('subgroup')) {
              console.log('Is subgroup: ' + this.joined[i].name);

              if (this.joined[i].group_id === groupID) {
                console.log('Detected subgroup which is not in free!');
                console.log('Subgroup element: ');
                const saveSubgroup = this.joined[i];
                console.log(saveSubgroup);
                this.free.push(saveSubgroup);
              } else {
                toSplice.push(this.joined[i]);
              }
            } else {
              toSplice.push(this.joined[i]);
            }
          }

          this.joined = toSplice;
        }
      }

      this.joinedChanged.emit(this.joined.slice());
      this.freeChanged.emit(this.free.slice());
    }
  }
}
