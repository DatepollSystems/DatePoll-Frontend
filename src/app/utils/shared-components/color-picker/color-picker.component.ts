import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent {
  showColorPicker = false;

  colors = ['#ff5151', '#ffce5c', '#27dd70', '#16e7d9', '#CD47FF', '#726DFF', '#B6F423', '#BE935B'];

  @Input()
  color = '#fffff';

  @Output()
  colorChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  changeColorPickerVisibility() {
    this.showColorPicker = !this.showColorPicker;
  }

  changeComplete(event: any) {
    this.color = event.color.hex;
    this.showColorPicker = false;
    this.colorChange.emit(this.color);
  }
}
