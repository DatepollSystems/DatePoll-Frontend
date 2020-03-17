import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {IsMobileService} from '../../is-mobile.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnDestroy {
  showColorPicker = false;

  @Input()
  color = '#fffff';

  @Output()
  colorChange: EventEmitter<string> = new EventEmitter<string>();

  public isMobile = true;
  private isMobileSubscription: Subscription;

  constructor(private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe(value => {
      this.isMobile = value;
    });
  }

  ngOnDestroy(): void {
    this.isMobileSubscription.unsubscribe();
  }

  changeColorPickerVisibility() {
    this.showColorPicker = !this.showColorPicker;
  }

  changeComplete(event: any) {
    this.color = event.color.hex;
    this.showColorPicker = false;
    document.getElementById('color-picker-button').style.backgroundColor = this.color;
    this.colorChange.emit(this.color);
  }
}
