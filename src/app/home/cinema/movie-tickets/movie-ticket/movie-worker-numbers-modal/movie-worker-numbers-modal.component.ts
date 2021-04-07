import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {PhoneNumber} from '../../../../phoneNumber.model';

@Component({
  selector: 'app-movie-worker-numbers-modal',
  templateUrl: './movie-worker-numbers-modal.component.html',
  styleUrls: ['./movie-worker-numbers-modal.component.css'],
})
export class MovieWorkerNumbersModalComponent {
  numbers: PhoneNumber[];

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.numbers = data.numbers;
  }
}
