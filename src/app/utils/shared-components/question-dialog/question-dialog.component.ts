import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css'],
})
export class QuestionDialogComponent {
  answers: {
    answer;
    value;
  }[];

  question: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<QuestionDialogComponent>) {
    this.answers = data.answers;
    this.question = data.question;
    console.log(this.answers);
    console.log(this.question);
  }

  answerQuestion(value: string) {
    this.bottomSheetRef.dismiss(value);
  }
}
