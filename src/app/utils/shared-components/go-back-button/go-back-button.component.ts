import {Location} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.css']
})
export class GoBackButtonComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
