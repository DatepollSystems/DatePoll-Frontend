import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css'],
})
export class QuestionDialogComponent {
  public static YES_VALUE = 'yes';
  public static NO_VALUE = 'no';
  public static YES_NO_ANSWERS = [
    {
      icon: 'done',
      answer: 'YES',
      value: 'yes',
    },
    {
      icon: 'close',
      answer: 'NO',
      value: 'no',
    },
  ];

  answers: {
    icon: string | null;
    answer: string;
    value: string;
  }[];

  question: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<QuestionDialogComponent>) {
    if (data.answers) {
      this.answers = data.answers;
    } else {
      this.answers = QuestionDialogComponent.YES_NO_ANSWERS;
    }
    this.question = data.question;
    console.log(this.answers);
    console.log(this.question);
  }

  answerQuestion(value: string) {
    this.bottomSheetRef.dismiss(value);
  }
}
